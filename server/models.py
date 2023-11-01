from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
import string

metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)

db = SQLAlchemy(metadata=metadata)

class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    password_digest = db.Column(db.String)
    user_info = db.Column(db.String)

    rooms = db.relationship("Room", back_populates="user")

    def to_dict(self):
        return {"id": self.id, "username": self.username}

class Object(db.Model, SerializerMixin):
    __tablename__ = "objects"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    obj_file = db.Column(db.String, unique=True)
    obj_info = db.Column(db.String)
    
    combiners = db.relationship("Combiner", back_populates="object")
    def to_dict(self):
        return {"id": self.id, "name": self.name, "file": self.obj_file}

class Room(db.Model, SerializerMixin):
    __tablename__ = "rooms"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    roomInfo = db.Column(db.String)

    user = db.relationship("User", back_populates="rooms")
    combiners = db.relationship("Combiner", back_populates="room")
    # objs = [c.object for c in combiners]
    objs = association_proxy("combiners", "object")

    def to_dict(self):
        return {"id": self.id, "name": self.name, "roomInfo": self.roomInfo,}

class Combiner(db.Model, SerializerMixin):
    __tablename__ = "combiners"
    
    id = db.Column(db.Integer, primary_key=True)
    column = db.Column(db.String, nullable=False) #what this does
    room_id = db.Column(db.Integer, db.ForeignKey("rooms.id")) 
    obj_id = db.Column(db.Integer, db.ForeignKey("objects.id"))

    room = db.relationship("Room", back_populates="combiners")
    object = db.relationship("Object", back_populates="combiners")

