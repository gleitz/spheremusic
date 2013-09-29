from flask import Flask, render_template, jsonify, request, url_for
import sys
import satellites

app = Flask(__name__)

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
    sats = satellites.get_satellites()
    print sats
    return jsonify(results=list(sats))

if __name__ == "__main__":
    debug = False
    if len(sys.argv) > 1 and sys.argv[1] == 'debug':
        debug = True
    app.run(host='0.0.0.0', debug=debug, port=1337)
