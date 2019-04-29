import json
import socket
from threading import Thread
from random import randint

from flask import Flask, send_from_directory, request, render_template
from flask_socketio import SocketIO, emit
app = Flask(__name__)
socket_server = SocketIO(app)

import eventlet

eventlet.monkey_patch()


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
    user_socket = usernameToSid.get(username, None)
    message = {"username": username, "action": "connected"}
    if user_socket:
        socket_server.emit('message', message, room=user_socket)
    # send_to_js(message)

# pls work

@socket_server.on('start')
def start():
    print("start")
    # user_socket = usernameToSid.get(username, None)
    # socket_server.emit('start', room=user_socket)

# @socket_server.on('gotname')
# def gotname(name):
#     print(name)
#

@socket_server.on('name')
def n(name):
    print(name)

# @socket_server.on('test')
# def test(t):
#     print(t)


@app.route('/game', methods=["POST", "GET"])
def game():
    if request.method == "POST":
        username = request.form.get('username')
        # print(username)
    else:
        username = "guest" + str(randint(0, 100000))

    # return send_from_directory('/Users/MasPosInc/IdeaProjects/projectcse116/game', 'index.html')
    return render_template('index.html', username=username)

@app.route('/')
def index():
    return send_from_directory('/Users/caseywhelan/IdeaProjects/project116cse/game', 'startPage.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('/Users/caseywhelan/IdeaProjects/project116cse/game', filename)



# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

print("listening on port 8080")
socket_server.run(app, port=8080)