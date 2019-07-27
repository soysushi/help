import os
import time
import json

from datetime import datetime
from flask import Flask, jsonify, render_template, request, redirect
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
    # check if value is inside dicts
    if chatroom in chatrooms.keys():
        return jsonify({"success": False})
    # if the chatro does not yet exist, add to chats
    chatrooms[chatroom] = {}
    chatrooms[chatroom][username] = {}
    return jsonify({"success": True, "chatroom": chatroom})

#channel websocket listening when user has entered a channel, display current text
@socketio.on("enter channel")
def enter_channel(data):
    # load existing messages
    chatroom = data["contents"]
    username = data["username"]
    # check chatroom for messages
    chatroom_messages = chatrooms[chatroom]
    chatroom_messages = json.dumps(chatroom_messages)
    username = json.dumps(username)
    print("am i getting loaded on refresh?")
    emit("load messages", {"chatroom_messages": chatroom_messages, "username":username}, broadcast=False)

@socketio.on("send message")
def messages(data):
    # getting the data from the client
    message = data["message"]
    chatroom = data["chatroom"]
    username = data["username"]
    # append the messages to the correct chatroom and username
    now = datetime.now()
    date_time = now.strftime("%m/%d/%Y, %H:%M:%S")
    try:
        chatrooms[chatroom][username][date_time] = message
    except:
        print(chatroom, username)
        chatrooms[chatroom][username] = {}
        chatrooms[chatroom][username][date_time] = message

    message = json.dumps(chatrooms[chatroom][username])
    # variable that holds the length of the dictionary
    dict_length = len(chatrooms[chatroom][username])
    # variable that holds the first key to the dictionary
    first_msg = list(chatrooms[chatroom][username].keys())[0]
    last_msg_time = list(chatrooms[chatroom][username].keys())[-1]
    last_msg = list(chatrooms[chatroom][username].values())[-1]
    # plugging in the recent message into dictionary
    username = json.dumps(username)
    chatroom = json.dumps(chatroom)
    print(last_msg_time, last_msg)
    if (dict_length >= 100):
        temp = chatrooms[chatroom][username].pop(first_msg, None)
        print (dict_length)
        print (chatrooms)
    # message itself contains
    emit("append messages", {"message":message, "username":username, "chatroom": chatroom}, broadcast=True)
