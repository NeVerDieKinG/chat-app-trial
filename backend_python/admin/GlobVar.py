from admin.CustomDatabase import CustomDatabase

def init():
  global User2SocketId_dict
  User2SocketId_dict = {}
  global MessageDB
  MessageDB = CustomDatabase(Name='Message')
  global ConversationDB
  ConversationDB = CustomDatabase(Name='Conversation')
  global UserDB
  UserDB = CustomDatabase(Name='User')
