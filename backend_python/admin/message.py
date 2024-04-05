from flask import jsonify, request, make_response, Blueprint
from flask_socketio import SocketIO, emit


from admin.utils.HandleException import HandleException
from admin.utils.getClientUserFromCookie import getClientUserFromCookie
from admin.utils.getSocketIdOfUser import getSocketIdOfUser
import admin.GlobVar as GlobVar

import jwt
from dotenv import load_dotenv
load_dotenv()
import os
JWT_SECRET = os.getenv("JWT_SECRET")
import datetime

message = Blueprint(
    "message", 
    __name__, 
    static_folder="static", 
    template_folder="templates"
  )

MessageDB = GlobVar.MessageDB
ConversationDB = GlobVar.ConversationDB

@message.route('/<ReceiveUserId>', methods=['GET'])
@HandleException
def getMessage(ReceiveUserId: str):
  # print(ReceiveUserId)
  SendUserId = getClientUserFromCookie()
  if SendUserId == ReceiveUserId:
    return jsonify({'error': 'You cannot have message to yourself!'}), 400
  # Message = request.json['Message']
  Conversation = ConversationDB.findData({
    'ParticipatedUserId': [SendUserId, ReceiveUserId]
  })
  if Conversation is None:
    return jsonify([]), 200
  
  MessageId_lst = Conversation['AllMessageId']
  Message = MessageDB.findData({'MessageId': MessageId_lst}, IsOutputList=True)
  return jsonify(Message), 200

@message.route('/send/<ReceiveUserId>', methods=['POST'])
@HandleException
def sendMessage(ReceiveUserId: str):
  Message = request.json['Message']
  SendUserId = getClientUserFromCookie()
  if SendUserId == ReceiveUserId:
    return jsonify({'error': 'You cannot send message to yourself!'}), 400 
  Conversation = ConversationDB.findData({
    'ParticipatedUserId': [SendUserId, ReceiveUserId]
  })
  if Conversation is None:
    Conversation = ConversationDB.addData({
      'ParticipatedUserId': [SendUserId, ReceiveUserId],
      'AllMessageId': []
    }, IdKey='ConversationId')
    ConversationId = Conversation['ConversationId']

  Message = MessageDB.addData({
    'Message': Message,
    'SendUserId': SendUserId,
    'ReceiveUserId': ReceiveUserId,
    'CreatedAt': str(datetime.datetime.now()),
  }, IdKey='MessageId')

  ReceiveUserSocketId = getSocketIdOfUser(ReceiveUserId)
  if ReceiveUserSocketId is not None:
    emit('newMessage', Message, room=ReceiveUserSocketId, namespace='/')


  Conversation['AllMessageId'].append(Message['MessageId'])
  # print(Conversation)
  ConversationDB.modifyData(Conversation, IdKey='ConversationId')

  return jsonify(Message), 200


