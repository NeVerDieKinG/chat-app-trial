from flask import jsonify, request, make_response, Blueprint
from admin.CustomDatabase import CustomDatabase
from admin.utils.HandleException import HandleException
from admin.utils.getClientUserFromCookie import getClientUserFromCookie
import jwt
from dotenv import load_dotenv
load_dotenv()
import os
JWT_SECRET = os.getenv("JWT_SECRET")


UserDB = CustomDatabase(Name='User')

User = Blueprint(
    "User", 
    __name__, 
    static_folder="static", 
    template_folder="templates"
  )


@User.route('', methods=['GET'])
@HandleException
def getUserForSidebar():
  ClientUserId = getClientUserFromCookie()
  FilteredUser_lst = UserDB.findData(
      {'UserId': {'neq': ClientUserId}}, 
      IsOutputList = True,
      DropKey_lst = ['Password']
    )
  return jsonify(FilteredUser_lst), 200
