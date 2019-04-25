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
from flask import jsonify
from dbPopulate import db_load_restaurants
app = FlaskAPI(__name__)
session = DatabaseHandler.connect_to_database()
engine =DatabaseHandler.returnEngine()

def run():
	app.run(host=config.HOST, port=config.PORT, debug=True, threaded=False, processes=1)
@app.route('/', methods=['GET'])
def indexRoute():
	return("Hello World")
@app.route('/order',methods=['GET'])
def get_orders():
    allorders = session.query(order).all()
    session.close()
    ordersArray =[];
    for thisorder in allorders:
        current_order ={
         'name': thisorder.name,
         'restaurant id' : thisorder.restaurant,
         'amount':thisorder.amount,
         'user' : thisorder.user,
         'resName':thisorder.resName,
         'time': thisorder.order_time,
         'cityName':thisorder.city
        }
        ordersArray.append(current_order)
    
    return {
        'status':'OK',
        'message':'SUCCESS',
        'array':ordersArray
    }, 200
@app.route('/order', methods=['POST'])
def add_order():
    info = order(name = request.data['name'], resName = request.data['resName'], amount =request.data['amount'], restaurant = request.data['restaurant'],user = request.data['user'], city = request.data['city'])
    session.add(info)
    try:
        session.commit()
    except:
        session.rollback()
        flash(config.UNEXPECTED_ERROR)
    finally:
        session.close()
    return {
        'status': 'success'
    }
@app.route('/user/add',methods=['GET','POST'])
def addUser():
    if request.method == 'POST':

        info = user(username= request.data['username'])
        
        session.add(info)
        try:
            session.commit()
        except:
            session.rollback()
            flash(config.UNEXPECTED_ERROR)
        finally:
            session.close()
        return{
            'status':'OK',
            'message':'SUCCESS',
        },200
    else:
        alluser = session.query(user).all()
        print("Here")
        usersArray =[]
        print(alluser)
        for a_user in alluser:
            temp_user ={
                'username' : a_user.username
            }
            usersArray.append(temp_user);
        if not usersArray:
            return {
                'status': 'BAD request'
            }

        return  {
            'status':'OK',
            'message':'SUCCESS',
            'array': usersArray
        }, 200
@app.route('/restaurant',methods=['GET'])
def getRestaurants():
    all_restauranst = session.query(restaurants).all();
    session.close
    restaurant_array= []
    for restaurant in all_restauranst:
        current_restaurant ={
            'name' : restaurant.name,
            'cityPin' : restaurant.cityCode,
            'cityName': restaurant.cityName,
            'restaurantId' : restaurant.id
        }
        restaurant_array.append(current_restaurant)
    if not restaurant_array:
        return{
            'status' : 'NO restaurants Found'
        }
    return {
        'status':'OK',
        'message': 'SUCCESS',
        'array':restaurant_array
    }
@app.route('/restaurant', methods=['POST'])
def addRestaurant():
    info = restaurants(name = request.data['name'], cityCode  = request.data['cityCode'], cityName = request.data['cityName'] )
    session.add(info)
    try:
        session.commit()
    except:
        session.rollback()
        flash(config.UNEXPECTED_ERROR)
    finally:
        session.close()
    return {
        'status' : 'OK',
        'message' : 'SUCCESS'
    }

@app.route('/test',methods=['GET'])
def test():
    result = []
    query = str(request.args.get('query'))
    try:
        con =engine.connect()
        rs = con.execute(query)
        d,a  = {}, []
        for rowproxy in rs:
            for column,value in rowproxy.items():
                d ={**d, **{column:value}}
            result.append(d)

    finally:
        con.close()
    for data in result:
        print(data)
    return result
if __name__ == '__main__':
    run()
