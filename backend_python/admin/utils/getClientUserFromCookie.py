from flask import request
import jwt
from dotenv import load_dotenv
load_dotenv()
import os
JWT_SECRET = os.getenv("JWT_SECRET")


def getClientUserFromCookie():
  Token = request.cookies.get('jwt')
  if Token is None:
    return None

  Decoded = jwt.decode(Token, JWT_SECRET, algorithms=["HS256"])
  UserId = str(Decoded['UserId'])
  
  return UserId