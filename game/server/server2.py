
import json
import socket
from threading import Thread
from random import randint

from flask import Flask, send_from_directory, request, render_template
from flask_socketio import SocketIO, emit

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from game.database import Database

app = Flask(__name__)
socket_server = SocketIO(app)

import eventlet

eventlet.monkey_patch()

def foodGenerator():
    foodkey = {}
    for i in range(30):
        label = "G" + str(i)
        foodkey[label] = {"x": randint(100, 2900), "y": randint(100, 1400)}
    for f in Database.returnFood():
        foodkey[f[0]] = {"x": f[1], "y": f[2]}
    return foodkey

usernameToSid = {}
sidToUsername = {}
SidToScore = {}

foodkey = foodGenerator()
playerinfo = {}
highestScorer = Database.getHighestScore()
# gameinfo = {'food': foodkey, "playerinfo": playerinfo}




@socket_server.on('register')
def got_message(username):
    usernameToSid[username] = request.sid
    sidToUsername[request.sid] = username
    SidToScore[request.sid] = 0
    print(username + " connected")
    print(usernameToSid)
    print(sidToUsername)
    print(SidToScore)

@socket_server.on('newPlayer')
def newP():
    # personal = {request.sid: {'x': randint(100, 2900), 'y': randint(100, 1400)}}
    personal = {request.sid: {'x': 200, 'y': 200}}
    gameinfo = {'food': foodkey, 'playerinfo': playerinfo, 'personal': personal, 'highscore': highestScorer}
    socket_server.emit('message', json.dumps(gameinfo), room=request.sid)
    socket_server.emit('newP', json.dumps(personal), broadcast=True, include_self=False)
    playerinfo[request.sid] = personal[request.sid]
    Database.createPlayer(sidToUsername[request.sid])

    print(playerinfo)

@socket_server.on('disconnect')
def removeP():
    if request.sid in sidToUsername:
        socket_server.emit('removePlayer', json.dumps(request.sid), broadcast=True)
    if request.sid in playerinfo:
        del playerinfo[request.sid]
        Database.removePlayer(sidToUsername[request.sid])
        del SidToScore[request.sid]
    username = sidToUsername[request.sid]
    del sidToUsername[request.sid]
    del usernameToSid[username]
    print("disconnected")
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
        Database.removePlayer(sidToUsername[request.sid])
    username = sidToUsername[request.sid]
    # del sidToUsername[request.sid]
    # del usernameToSid[username]
    del SidToScore[request.sid]
    # print(playerinfo)

@socket_server.on('foodEaten')
def eat(data):
    # print(foodkey)
    username = sidToUsername[request.sid]
    if "G" in data:
        SidToScore[request.sid] += 30
        foodkey[data] = {"x": randint(100, 2900), "y": randint(100, 1400)}
        socket_server.emit('deleteFood', json.dumps({data: foodkey[data]}), broadcast=True)
        if SidToScore[request.sid] > highestScorer["score"]:
            highestScorer["username"] = username
            highestScorer["score"] = SidToScore[request.sid]
            socket_server.emit('highscore', json.dumps(highestScorer), broadcast=True)
    else:
        SidToScore[request.sid] -= 30
        foodkey[data]["eaten"] = True
        socket_server.emit('deleteFood', json.dumps({data: foodkey[data]}), broadcast=True)
        del foodkey[data]
        Database.removePoisonFood(data)
    Database.update(username, SidToScore[request.sid])

    print('foodeaten ' + request.sid)
    # socket_server.emit('updateScore', )


@socket_server.on('plantPoison')
def poison(data):
    message = json.loads(data)
    key = str(randint(0,100000))
    foodkey[key] = message
    Database.createFood(key, message['x'], message['y'])
    socket_server.emit('deleteFood', json.dumps({key: message}), broadcast=True)
    print(foodkey[key])


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