from flask import Flask, render_template, jsonify, request, url_for
import sys
import satellites

app = Flask(__name__)
app.config.from_object({'SEND_FILE_MAX_AGE_DEFAULT': 0})

def _success():
    return render_template('template.html',
                           title = 'Almost there!!',
                           top = 114,
                           left = 200,
                           edison_url = url_for('static',filename='hex.png'))

def _final():
    return 'http://{0}{1}'.format(request.host, url_for('static',filename='congrats.jpg'))

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/ajax/satellites", methods = ['GET'])
def ajax_satellites():
    sats = list(satellites.get_satellites())[:20]
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
    app.run(host='0.0.0.0', debug=debug, port=1337)
