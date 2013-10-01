from flask import Flask, render_template, jsonify, request, url_for, redirect
import sys
import json
import satellites
import pygeoip
from pygeocoder import Geocoder
from flaskutil import ReverseProxied

app = Flask(__name__)
app.wsgi_app = ReverseProxied(app.wsgi_app)
app.config.from_object({'SEND_FILE_MAX_AGE_DEFAULT': 0})

GIC  = pygeoip.GeoIP('ip_database/GeoLiteCity.dat')

@app.route("/")
def home():
    lat = None
    lng = None
    rhythm = request.args.get('rhythm')
    error = ''
    try:
        if rhythm:
            rhythm = json.loads(rhythm)
            rhythm = json.dumps(rhythm, indent=4, sort_keys=True)
    except Exception, e:
        print e
        error = "Invalid JSON!"
    address = request.args.get('address')
    if address:
        results = Geocoder.geocode(address)
        if results and len(results) > 0:
            coords = results[0].coordinates
            lat = coords[0]
            lng = coords[1]
            address = results[0].formatted_address
    if not lat and not lng:
        ip_address = request.remote_addr
        user_loc = GIC.record_by_addr(ip_address)
        if user_loc and user_loc.get('latitude'):
            lat = user_loc['latitude']
            lng = user_loc['longitude']
            address = '({0}, {1})'.format(lat, lng)
    if not lat and not lng:
        lat = 37.7701
        lng = -122.4664
        address = 'California Academy of Sciences, San Francisco, CA'.format(lat, lng)
    return render_template('index.html', lat=lat, lng=lng, address=address, rhythm=rhythm, error=error)

@app.route("/ajax/satellites", methods = ['GET'])
def ajax_satellites():
    lat = str(request.args.get('lat', ''))
    lng = str(request.args.get('lng', ''))
    sats = list(satellites.get_satellites(lat=lat, lng=lng))[:20]
    min_velocity = sys.maxint
    max_velocity = 0
    min_range = sys.maxint
    max_range = 0
    for sat in sats:
        velocity = abs(sat['velocity'])
        if velocity > max_velocity:
            max_velocity = velocity
        if velocity < min_velocity:
            min_velocity = velocity
        if sat['range'] > max_range:
            max_range = sat['range']
        if sat['range'] < min_range:
            min_range = sat['range']

    return jsonify({'satellites': sats,
                    'min_velocity': min_velocity,
                    'max_velocity': max_velocity,
                    'min_range': min_range,
                    'max_range': max_range})

if __name__ == "__main__":
    debug = False
    if len(sys.argv) > 1 and sys.argv[1] == 'debug':
        debug = True
    app.run(host='0.0.0.0', debug=debug, port=1338)
