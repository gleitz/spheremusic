from flask import Flask, render_template, jsonify, request, url_for
import sys

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

@app.route("/next", methods = ['GET', 'POST'])
def login():
    if request.method == 'GET' or not request.form.get('nextState'):
        return _nedry()
    next_state = request.form['nextState']
    if next_state.lower() == 'rickrolle':
        return _final()
    current_page = -1
    for i, word in enumerate(rhyme):
        if sha1(word) == next_state:
            current_page = i
    if current_page == -1:
        return _nedry()
    print "current page is", current_page
    next_page = current_page + 1
    if next_page >= len(RICK_PIECES):
        return _success()
    return _get_piece(next_page)

if __name__ == "__main__":
    debug = False
    if len(sys.argv) > 1 and sys.argv[1] == 'debug':
        debug = True
    app.run(host='0.0.0.0', debug=debug, port=1337)
