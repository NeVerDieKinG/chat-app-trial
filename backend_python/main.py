import admin.GlobVar as GlobVar
GlobVar.init()

from flask import Flask, request
from flask_socketio import SocketIO, emit
from admin.auth import auth
from admin.message import message
from admin.User import User

from dotenv import load_dotenv
load_dotenv()
import os
JWT_SECRET = os.getenv("JWT_SECRET")
NODE_ENV = os.getenv("NODE_ENV")
SERVER_PORT = os.getenv("SERVER_PORT")

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

app.register_blueprint(auth, url_prefix='/api/auth')
app.register_blueprint(message, url_prefix='/api/message')
app.register_blueprint(User, url_prefix='/api/User')

# def initGlobVar():
#   global GlobVar.User2SocketId_dict
#   GlobVar.User2SocketId_dict = {}

import admin.Socket


if __name__ == '__main__':
  # app.run(debug=True, port=int(SERVER_PORT))
  socketio.run(app, debug=True, port=int(SERVER_PORT))