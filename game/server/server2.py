import json
import socket
from threading import Thread
from random import randint

from flask import Flask, send_from_directory, request, render_template
from flask_socketio import SocketIO, emit
app = Flask(__name__)
socket_server = SocketIO(app)
from random import randint

import eventlet

eventlet.monkey_patch()

def foodGenerator():
    foodkey = {}
    for i in range(50):
        foodkey[i] = {"x": randint(100, 2900), "y": randint(100, 1400)}
    return foodkey

def escapeGenerator():
    escapekey = {}
    for i in range(20):
        escapekey[i] = {"x": randint(100, 2900), "y": randint(100, 1400)}
    return escapekey


usernameToSid = {}
sidToUsername = {}
playerList = []
playerinfo = {}
choppingBlockers = 0
choppingMode = False
gettingChopped = True
food = foodGenerator()
escapes = escapeGenerator()
gameStatus = {"choppingMode": choppingMode,  "food": food, "escapes": escapes}



# js_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# js_socket.connect(('localhost', 8000))

# def send_to_js(data):
#     js_socket.sendall(json.dumps(data).encode())


#


@socket_server.on('register')
def got_message(username):
    usernameToSid[username] = request.sid
    print(request.sid)
    sidToUsername[request.sid] = username
    print(username + " connected")



    # send_to_js(message)

# pls work

@socket_server.on('disconnect')
def disconnect():
    if request.sid in sidToUsername:
        for i in range(len(playerList)):
            if playerList[i]["id"] == request.sid:
                socket_server.emit('removePlayer', json.dumps(playerList[i]), broadcast=True)
                playerList.pop(i)
                break
        username = sidToUsername[request.sid]
        del sidToUsername[request.sid]
        del usernameToSid[username]
        print(username + " disconnected")
        print(playerList)


@socket_server.on('start')
def start(data):
    message = json.loads(data)
    username = message["username"]
    print(username + " pressed start")

    # print(playerinfo)
    # print(playerList)


    playerinfo = {"id": request.sid, "username": username, "score": 0, "meter": 0, "x": 1500, "y": 900, "vx": 0, "vy": 0,
                  "gettingChopped": gettingChopped, "choppingBlockers": choppingBlockers}

    gameinfo = {"gameStatus": gameStatus, "playerList": playerList, "personal": playerinfo}

    user_socket = usernameToSid.get(username, None)
    if user_socket:
        socket_server.emit('message', json.dumps(gameinfo), room=user_socket)
        socket_server.emit('startGame', json.dumps(playerinfo), room=user_socket)

    socket_server.emit('newPlayer', json.dumps(playerinfo), broadcast=True, include_self=False)

    playerList.append(playerinfo)

@socket_server.on('foodEaten')
def eat(data):
    message = json.loads(data)
    socket_server.emit('deleteFood', json.dumps(message), broadcast=True, include_self=False)
    # print(food[int(message)])
    # food[int(message)] = {"x": food[int(message)]["x"] + 100, "y": food[int(message)]["y"]}
    food[int(message)] = {"x": randint(100, 2900), "y": randint(100, 1400)}
    # print(food[int(message)])
    socket_server.emit('regenFood', json.dumps({int(message): food[int(message)]}), broadcast=True)
    # socket_server.emit()


@socket_server.on('move_player')
def move(data):
    message = json.loads(data)
    # print(message)
    # print("player moved")
    message["id"] = request.sid
    # print(message)
    for i in playerList:
        if i["id"] == request.sid:
            i["x"] = message["x"]
            i["y"] = message["y"]
            i["vx"] = message['vx']
            i["vy"] = message['vy']
            # print(i)
    # print(message)
    socket_server.emit('enemyMoved', json.dumps(message), broadcast=True, include_self=False)



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
    return send_from_directory('/Users/oukan/IdeaProjects/project116/game', 'startPage.html')

@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('/Users/oukan/IdeaProjects/project116/game', filename)



# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

print("listening on port")
socket_server.run(app, port=8000)