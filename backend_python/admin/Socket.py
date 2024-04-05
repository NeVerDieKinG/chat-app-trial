
from __main__ import socketio
import admin.GlobVar as GlobVar
from flask import request
from flask_socketio import SocketIO, emit

@socketio.on('connect')
def connection(auth):
  # Socket id
  SocketId = request.sid
  print('a user connected', SocketId)
  
  UserId = request.args.get('UserId')
  GlobVar.User2SocketId_dict[UserId] = SocketId

  emitOnlineUser()
  
def emitOnlineUser():
  print(GlobVar.User2SocketId_dict)
  emit(
      'getOnlineUser', 
      list(GlobVar.User2SocketId_dict.keys()), 
      broadcast=True,
    )
  
@socketio.on('disconnect')
def disconnect():
  SocketId = request.sid
  print('a user disconnected', SocketId)
  UserId = next(
      (k for k, v in GlobVar.User2SocketId_dict.items() if v == SocketId), 
      None
    )
  if UserId is not None:
    del GlobVar.User2SocketId_dict[UserId]
  
  emitOnlineUser()