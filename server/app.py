#!/usr/bin/env python3

from flask import Flask, request, session, jsonify
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from models import db, User, Room, Object
from flask_cors import CORS
app = Flask(__name__)
app.secret_key = b"Y\xf1Xz\x00\xad|eQ\x80t \xca\x1a\x10K"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
cors = CORS(app, resources={r"*": {"origins": "*"}})
bcrypt = Bcrypt(app)

migrate = Migrate(app, db)

db.init_app(app)

# USER SIGNUP #

@app.route("/users", methods=["POST"])
def create_user():
    data = request.json
    print(data)
    username = data["username"]
    password = data["password"]
    try:
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return {"error": "Username already exists"}, 400

        password_digest = bcrypt.generate_password_hash(password).decode("utf-8")

        new_user = User(username=username, password_digest=password_digest)
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict(), 201
    except Exception as e:
        print(e)
        return {}

# SESSION LOGIN/LOGOUT #

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data["username"]
    password = data["password"]

    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password_digest, password):
        session["user_id"] = user.id
        return user.to_dict(), 200
    else:
        return {"error": "Invalid username or password"}, 401

@app.route("/check_session", methods=["GET"])
def check_session():
    user_id = session.get("user_id")
    if user_id:
        user = User.query.get(user_id)
        if user:
            return user.to_dict(), 200
    return {"message": "No user logged in"}, 401

@app.route("/logout", methods=["DELETE"])
def logout():
    session.pop("user_id", None)
    return {"message": "Logged out"}, 200

# EXAMPLE OTHER RESOURCES WITH AUTH #

@app.route("/rooms", methods=["GET"])
def get_rooms():
    return [r.to_dict() for r in Room.query.all()]


@app.route("/rooms/<int:room_id>", methods=["GET"])
def get_roomById(room_id):
    user_id = session.get("user_id")
    if user_id:
        user = User.query.get(user_id)
        if user:
            room = user.get_room(room_id)
            if room:
                return room.to_dict(), 200
    return {"error": "Not authorized"}, 401


@app.get("/rooms/museum")
def get_museum():
    room = Room.query.get(1)
    room_id = room.id
    room_objs = room.objs
    data_list = []
    for o in room_objs:
        o.to_dict()
        data_list.append(o.to_dict())
    return data_list, 200

@app.get("/rooms/userroom")
def get_userroom():
    user_id = session.get('user_id')
    room = Room.query.filter_by( user_id=user_id).first()
    room_objs = room.objs
    data_list = []
    for o in room_objs:
        o.to_dict()
        data_list.append(o.to_dict())
    return data_list, 200

@app.route("/rooms/userroom", methods=["POST"])
def add_obj_to_room():
    # Assuming you have user authentication and the user's ID is stored in the session
    user_id = session.get('user_id')
    
    # if not user_id:
    #     return jsonify({'error': 'User not authenticated'}), 401
    
    # Get the data from the POST request
    data = request.json
    obj_id = data.get('obj_id')
    
    # Validate the received data (object_id and room_id should be present)
    if not obj_id:
        return jsonify({'error': 'Missing data'}), 400

    # Fetch the room by ID and verify that it belongs to the user
    room = Room.query.filter_by( user_id=user_id).first()
    
    if room is None:
        return jsonify({'error': 'Room not found or you do not have permission to add objects to this room'}), 404
    
    # Fetch the object by ID
    obj = Object.query.get(obj_id)
    
    if obj is None:
        return jsonify({'error': 'Object not found'}), 404
    
    # Add the object to the room's object list
    # This depends on how your Room and Object models are related; 
    # here it's assumed that Room has a relationship to Object named 'objects'
    room.objs.append(obj)
    
    # Commit the changes to the database
    try:
        db.session.add(room)
        db.session.commit()
        return jsonify({'success': 'Object added to room successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Database error', 'message': str(e)}), 500

# room = get room by user id
# object = get object by obj_id_
# room.objs.append(object)??
'''
get /museum
get room id 1
return list of room.objs (to_dict())
'''
#get main room
# @app.route("/rooms/main", methods=["GET"])
# def get_mainRoom():
#     if session.get("user_id"):
#         user_id = session["user_id"]
#         user = User.query.get(user_id)
#         if user:
#             rooms = user.rooms
#             room_data = [room.to_dict() for room in rooms]
#             return jsonify(room_data), 200
#     return {"error": "Not authorized"}, 401


# #get room by id
# @app.route("/rooms/<int:room_id>", methods=["GET"])
# def get_roomById(room_id):
#     if session.get("user_id"):
#         user_id = session["user_id"]
#         user = User.query.get(user_id)
#         if user:
#             room = user.get_room(room_id)
#             if room:
#                 return room.to_dict(), 200
#     return {"error": "Not authorized"}, 401

# if session.get("user_id"):
#     user_id = session["user_id"]
#     user = User.query.get(user_id)
#     if user:
#         rooms = user.rooms
#         room_data = [room.to_dict() for room in rooms]
#         return jsonify(room_data), 200
# return {"error": "Not authorized"}, 401



@app.route("/rooms", methods=["POST"])
def create_room():
    
    data = request.json
    print(data)
    roomName = data["room"]
    roomInfo = data["roomInfo"]
    user_id = session.get("user_id")
    print(user_id)
    try:
        existing_room = Room.query.filter_by(name=roomName).first()
        if existing_room:
            return {"error": "Username already exists"}, 400


        new_room = Room(name=roomName, roomInfo=roomInfo, user_id=user_id)
        db.session.add(new_room)
        db.session.commit()
        return new_room.to_dict(), 201
    except Exception as e:
        print(e)
        return {}

@app.route("/objects", methods=["GET"])
def get_objects():
    if session.get("user_id"):
        user_id = session["user_id"]
        user = User.query.get(user_id)
        if user:
            objects = user.get_objects()
            object_data = [obj.to_dict() for obj in objects]
            return jsonify(object_data), 200
    return {"error": "Not authorized"}, 401

# APP RUN #

if __name__ == "__main__":
    app.run(port=5555, debug=True)
