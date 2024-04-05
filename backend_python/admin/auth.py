from flask import Flask, jsonify, request, make_response, Blueprint
import bcrypt
from admin.CustomDatabase import CustomDatabase
from admin.utils.HandleException import HandleException
import jwt
from dotenv import load_dotenv
load_dotenv()
import os
JWT_SECRET = os.getenv("JWT_SECRET")
NODE_ENV = os.getenv("NODE_ENV")

import admin.GlobVar as GlobVar
UserDB = GlobVar.UserDB

auth = Blueprint(
    "auth", 
    __name__, 
    static_folder="static", 
    template_folder="templates"
  )


def generateTokenAndSetCookie(UserId, Response):
  Token = jwt.encode(
      {"UserId": UserId}, 
      JWT_SECRET, 
      algorithm="HS256"
    )

  Response.set_cookie(
      "jwt",
      Token,
      max_age=15 * 24 * 60 * 60,
      httponly=True,
      samesite="Strict",
      secure=(NODE_ENV != "development")
  )
  return Response

@auth.route('/signup', methods=['POST'])
@HandleException
def singup():
  # print(request.json)
  FullName = request.json['FullName']
  UserName = request.json['UserName']
  Password = request.json['Password']
  ConfirmPassword = request.json['ConfirmPassword']
  Gender = request.json['Gender']

  # Check if Password and Confirm Password match
  if (Password != ConfirmPassword):
    return jsonify({'error': 'Password and Confirm Password do not match!'}), 400

  HashedPassword = bcrypt.hashpw(
      Password.encode('utf-8'), 
      bcrypt.gensalt(10),
    ).decode('utf-8')
  # Check if User already exists
  User = UserDB.findData({'UserName': UserName})
  if User is not None:
    print(User)
    return jsonify({'error': 'User already exists!'}), 400
  BoyProfilePic = f'https://avatar.iran.liara.run/public/boy?username=${UserName}'
  GirlProfilePic = f'https://avatar.iran.liara.run/public/girld?username=${UserName}'

  # Add User to Database
  NewUser_dict = UserDB.addData({
    'FullName': FullName,
    'UserName': UserName,
    'Password': HashedPassword,
    'Gender': Gender,
    'ProfilePic': (BoyProfilePic if Gender == 'male' else GirlProfilePic),
  }, IdKey='UserId')
  if NewUser_dict is not None:
    Response = make_response(jsonify({
      'UserId': NewUser_dict['UserId'],
      'FullName': NewUser_dict['FullName'],
      'UserName': NewUser_dict['UserName'],
      'ProfilePic': NewUser_dict['ProfilePic'],
    }), 201)
    Response = generateTokenAndSetCookie(
        NewUser_dict['UserId'],
        Response,
      )
    return Response

@auth.route('/login', methods=['POST'])
@HandleException
def login():
  UserName = request.json['UserName']
  Password = request.json['Password']

  User = UserDB.findData({'UserName': UserName})
  if User is None:
    return jsonify({'error': 'User not found!'}), 400
  
  IsPasswordCorrect = bcrypt.checkpw(
      Password.encode('utf-8'),
      User['Password'].encode('utf-8'),
    )
  if not IsPasswordCorrect:
    return jsonify({'error': 'Invalid Password!'}), 400
  
  Response = make_response(jsonify({
    'UserId': User['UserId'],
    'FullName': User['FullName'],
    'UserName': User['UserName'],
    'ProfilePic': User['ProfilePic'],
  }), 200)
  Response = generateTokenAndSetCookie(
      User['UserId'],
      Response,
    )
  return Response


@auth.route('/logout', methods=['POST'])
@HandleException
def logout():
  Response = make_response(jsonify({
    'message': 'Logged out successfully!'
  }), 200)
  Response.set_cookie(
      "jwt",
      "",
      max_age=0,
  )
  return Response