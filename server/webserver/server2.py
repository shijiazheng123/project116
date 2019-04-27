import json
import socket
from threading import Thread
from random import randint


from flask import Flask, send_from_directory, request, render_template
from flask_socketio import SocketIO
import eventlet
eventlet.monkey_patch()
app = Flask(__name__)
socket_server = SocketIO(app)


#@app.route('/')
#def index():
usernameToSid = {}
sidToUsername = {}

# js_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# js_socket.connect(('localhost', 8000))

# def send_to_js(data):
#     js_socket.sendall(json.dumps(data).encode())

# @socket_server.on('start')
# def create_game():
#     username = sidToUsername[request.sid]


@socket_server.on('register')
def got_message(username):
    usernameToSid[username] = request.sid
    sidToUsername[request.sid] = username
    print(username + " connected")
    # message = {"username": username, "action": "connected"}
    # send_to_js(message)

# pls work




# @app.route('/game', methods=["POST", "GET"])
# def game():
#     if request.method == "POST":
#         username = request.form.get('username')
#     else:
#         username = "guest" + str(randint(0, 100000))

 #   return render_template('game.html', username=username)


@app.route('/')
def index():
    return send_from_directory('/Users/caseywhelan/IdeaProjects/project116cse/game', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('/Users/caseywhelan/IdeaProjects/project116cse/game', filename)



# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

print("listening on port 8080")


socket_server.run(app, port=8080)