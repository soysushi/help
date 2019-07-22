import os
import time
import json

from datetime import datetime
from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

chatrooms = {}


#pop up to get user to login
@app.route("/")
def index():
    return render_template("index.html", chatrooms=chatrooms)

#user to add a new channel
@app.route("/add_chatroom", methods=["POST"])
def create_chatroom():
    # get chatroom name
    chatroom = request.form.get("chatroom")
    # get user name from local stroage
    username = request.form.get("username") # isn't this a string
    # check if value is inside dict
    if chatroom in chatrooms.keys():
        return jsonify({"success": False})

    # if the chatro does not yet exist, add to chats
    chatrooms[chatroom] = {}
    chatrooms[chatroom][username] = {}
    print(chatrooms)
    return jsonify({"success": True, "chatroom": chatroom})

#channel websocket listening when user has entered a channel, display current text
@socketio.on("enter channel")
def enter_channel(data):
    # load existing messages
    chatroom = data["contents"]
    print("channel has been entered in server side:")
    print("checking for existing messages in this chatroom")
    # check chatroom for messages
    chatroom_messages = chatrooms[chatroom]
    print(chatroom_messages)
    # still have to convert it server side...into json format
    chatroom_messages = json.dumps(chatroom_messages)
    emit("load messages", chatroom_messages, broadcast=True)

@socketio.on("send message")
def messages(data):
    # getting the data from the client
    message = data["message"]
    chatroom = data["chatroom"]
    username = data["username"]
    # append the messages to the correct chatroom and username
    now = datetime.now()
    date_time = now.strftime("%m/%d/%Y, %H:%M:%S")
    print(date_time)
    chatrooms[chatroom][username][date_time] = message
    temp = list(chatrooms[chatroom][username].values())[-1]
    recent_message = str(temp)
    message = {date_time: message}
    print("recent message:")
    print(recent_message)
    print(chatrooms)
    emit("append messages", message, broadcast=True)
