from flask_api import FlaskAPI
from flask import request, redirect, flash
from connections import DatabaseHandler
from models import order
from models import user
from models import restaurants
from models import tests
import config as config
from sqlalchemy import text
import json
from random import randint
from flask import jsonify
#creating a basic python file to populate the database with the queries
app = FlaskAPI(__name__)
session = DatabaseHandler.connect_to_database()
engine =DatabaseHandler.returnEngine()
name =['order1','order2', 'order3', 'order4']
amount = ['4000','200','100','700','300']
res_name = ['Dominos','Dominos2', 'Dominos3']
cityName = ['Delhi' , 'Kanpur' , 'Banglore']
cityCode = ['121001' , '222222' , '343434']
myuser = ['ricksrv5', 'unsortedArray','PaulPogba']
# declaring the sample data for the population
def db_load_restaurants():
	res_nameIndex =randint(0,len(res_name)-1)
	cityNameIndex =randint(0,len(cityName)-1)
	cityCodeIndex =randint(0,len(cityCode)-1)
	info = restaurants(name= res_name[res_nameIndex], cityCode = cityCode[cityCodeIndex] , cityName = cityName[cityNameIndex])
	print('info')
	session.add(info)
	try:
		session.commit()
	except:
		session.rollback()
	finally:
		session.close()
	return {
			'status':'OK'
		}
def db_load_order():	
	name_index = randint(0,len(name)-1)
	amount_index = randint(0, len(amount)-1)
	res_name_index = randint(0, len(res_name)-1)
	cityName_index = randint(0,len(cityName)-1)
	user_index = randint(0 , len(myuser)-1)
	info = order(name = name[name_index],resName = res_name[res_name_index], amount = amount[amount_index], restaurant = randint(0,12),  city = cityName[cityName_index] , user = myuser[user_index])
	session.add(info)
	try:
		session.commit()
	except:
		session.rollback()
		flash(config.UNEXPECTED_ERROR)
	finally:
		session.close()
	return {
			'status':'OK'
		}
def db_load_user():
	user_index = randint(0, len(myuser) -1)
	info = user(username = myuser[user_index])
	session.add(info)
	try:
		session.commit()
	except:
		session.rollback()
	finally:
		session.close()
	return {
			'status':'OK'
		}
for x in range(1,10):
	db_load_restaurants()
	db_load_user()
	db_load_order()
