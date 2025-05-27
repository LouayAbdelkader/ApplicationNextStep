from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
import jwt
import datetime
from flask_cors import CORS
from functools import wraps
from werkzeug.security import generate_password_hash, check_password_hash
import os

app = Flask(__name__)

# Récupération des variables d'environnement (config MongoDB et clé secrète)
mongo_uri = os.getenv('MONGO_URI')
secret_key = os.getenv('SECRET_KEY')

app.config['MONGO_URI'] = mongo_uri
app.config['SECRET_KEY'] = secret_key

# CORS configuré pour le frontend exposé
CORS(app, resources={r"/*": {"origins": "http://10.9.21.20:30090"}}, supports_credentials=True)

mongo = PyMongo(app)
users_collection = mongo.db.users

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = users_collection.find_one({'username': data['username']})
            if not current_user:
                return jsonify({'message': 'User not found!'}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except Exception:
            return jsonify({'message': 'Invalid token!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Invalid request'}), 400

    username = data['username']
    password = data['password']

    if users_collection.find_one({'username': username}):
        return jsonify({'message': 'User already exists'}), 409

    hashed_password = generate_password_hash(password)
    users_collection.insert_one({'username': username, 'password': hashed_password})

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'message': 'Invalid request: missing username or password'}), 400

    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({'username': username})

    if not user or not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = jwt.encode(
        {'username': username, 'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)},
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )
    return jsonify({'token': token})

@app.route('/profile', methods=['GET'])
@token_required
def profile(current_user):
    return jsonify({
        'username': current_user['username'],
        'message': 'Profile data fetched successfully'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
