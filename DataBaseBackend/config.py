import os


DB_PATH = os.path.join(os.path.dirname(__file__), 'zomato_trial_week.db')
SQLALCHEMY_DATABASE_URI = 'sqlite:///{}'.format(DB_PATH)
SQLALCHEMY_TRACK_MODIFICATIONS = False
DEBUG = True
HOST = '0.0.0.0'
PORT = 8080
SECRET_KEY = 'big_secret_cant_reveal'
UNEXPECTED_ERROR = 'Unexpected error occured, did you put in all the values?'

sqlite = {
    'CREATE_ENGINE_URL': 'sqlite:///{}'.format(DB_PATH)
}
