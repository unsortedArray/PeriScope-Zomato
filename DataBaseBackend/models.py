import config as config
import datetime
from flask import request
from flask_api import FlaskAPI
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, UniqueConstraint, create_engine, Date, Time, TIMESTAMP,DateTime
from sqlalchemy import Integer, ForeignKey, String, TypeDecorator, Unicode, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.sqlite import BLOB
from werkzeug.security import generate_password_hash, check_password_hash
from enum import Enum
app = FlaskAPI(__name__)
db = SQLAlchemy(app)
engine = create_engine(config.sqlite['CREATE_ENGINE_URL'], echo=True)
DeclarativeBase = declarative_base(engine)
metadata = DeclarativeBase.metadata
# importing the basic files and libraries

#defining the basic classes
class order(DeclarativeBase):
    __tablename__ = 'order'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200))
    resName = Column(String(200), ForeignKey('restaurants.name'))
    amount = Column(Integer)
    restaurant = Column(Integer, ForeignKey('restaurants.id'))
    city = Column(String, ForeignKey('restaurants.cityName'))
    order_time = Column(DateTime ,default=datetime.datetime.utcnow)
    user = Column(String(200),ForeignKey('user.username'));
    def __init__(self, name=None,resName =None , amount=None,restaurant=restaurant,user = user,city = city):
        self.name = name
        self.amount = amount
        self.resName = resName
        self.restaurant = restaurant
        self.user = user
        self.city = city
    def __repr__(self):
        return self.id
class restaurants(DeclarativeBase):
	__tablename__ = 'restaurants'
	id = Column(Integer,primary_key= True , autoincrement=True)

	name = Column(String(200))
	cityCode = Column(String(10))
	cityName = Column(String(40))
	def __init__(self , name = None ,cityCode = None , cityName = None):
		self.name = name
		self.cityName = cityName
		self.cityCode = cityCode
	def __repr__(self):
		return self.id

class user(DeclarativeBase):
    __tablename__ = 'user'
    username = Column(String(200), primary_key=True)
    def __init__(self, username=None ):
        self.username = username
    def __repr__(self):
        return self.username
        
    def get_id(self):
        try:
            return self.username
        except AttributeError:
            raise NotImplementedError('No `id` attribute - override `get_id`')
class tests(DeclarativeBase):
	__tablename__ = 'tests'
	name = Column(String(30), primary_key= True)
	def __init__(self, name = None):
		self.name = name
	def __repr__(self):
		return self.name      
metadata.create_all()
# creating the database using the metadata