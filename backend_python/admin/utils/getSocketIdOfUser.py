import admin.GlobVar as GlobVar

def getSocketIdOfUser(UserId):
  if UserId in GlobVar.User2SocketId_dict:
    return GlobVar.User2SocketId_dict[UserId]
  else:
    return None