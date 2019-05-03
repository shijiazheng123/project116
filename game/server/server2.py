
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

def foodGenerator():
    foodkey = {}
    for i in range(30):
        label = "G" + str(i)
        foodkey[label] = {"x": randint(100, 2900), "y": randint(100, 1400)}
    return foodkey

usernameToSid = {}
sidToUsername = {}
SidToScore = {}

foodkey = foodGenerator()
playerinfo = {}
# gameinfo = {'food': foodkey, "playerinfo": playerinfo}


# js_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# js_socket.connect(('localhost', 8000))


@socket_server.on('register')
def got_message(username):
    usernameToSid[username] = request.sid
    sidToUsername[request.sid] = username
    SidToScore[request.sid] = 0
    print(username + " connected")

@socket_server.on('newPlayer')
def newP():
    personal = {request.sid: {'x': randint(100, 2900), 'y': randint(100, 1400)}}
    gameinfo = {'food': foodkey, 'playerinfo': playerinfo, 'personal': personal}
    socket_server.emit('message', json.dumps(gameinfo), room=request.sid)
    socket_server.emit('newP', json.dumps(personal), broadcast=True, include_self=False)
    playerinfo[request.sid] = personal[request.sid]
    print(playerinfo)

@socket_server.on('disconnect')
def removeP():
    if request.sid in sidToUsername:
        socket_server.emit('removePlayer', json.dumps(request.sid), broadcast=True)
        del playerinfo[request.sid]
    username = sidToUsername[request.sid]
    del sidToUsername[request.sid]
    del usernameToSid[username]
    # print(playerinfo)

@socket_server.on('movePlayer')
def move(data):
    message = json.loads(data)
    if request.sid in sidToUsername:
        playerinfo[request.sid] = message
        socket_server.emit('move', json.dumps({request.sid: playerinfo[request.sid]}), broadcast=True)

@socket_server.on('lose')
def lose():
    if request.sid in sidToUsername:
        socket_server.emit('removePlayer', json.dumps(request.sid), broadcast=True)
        del playerinfo[request.sid]
    username = sidToUsername[request.sid]
    del sidToUsername[request.sid]
    del usernameToSid[username]
    # print(playerinfo)

@socket_server.on('foodEaten')
def eat(data):
    # print(foodkey)
    if "G" in data:
        SidToScore[request.sid] += 30
        foodkey[data] = {"x": randint(100, 2900), "y": randint(100, 1400)}
        socket_server.emit('deleteFood', json.dumps({data: foodkey[data]}), broadcast=True)
    else:
        SidToScore[request.sid] -= 30
        foodkey[data]["eaten"] = True
        socket_server.emit('deleteFood', json.dumps({data: foodkey[data]}), broadcast=True)
        del foodkey[data]



@socket_server.on('plantPoison')
def poison(data):
    message = json.loads(data)
    key = str(randint(0,100000))
    foodkey[key] = message
    socket_server.emit('deleteFood', json.dumps({key: message}), broadcast=True)


@app.route('/game', methods=["POST", "GET"])
def game():
    if request.method == "POST":
        username = request.form.get('username')
    else:
        username = "guest" + str(randint(0, 100000))

    return render_template('index.html', username=username)


#make sure to change directory names to the path of your computer

@app.route('/')
def index():
    return send_from_directory('/Users/MasPosInc/IdeaProjects/projectcse116/game', 'startPage.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('/Users/MasPosInc/IdeaProjects/projectcse116/game', filename)


print("listening on port 8080")
socket_server.run(app, port=8080)