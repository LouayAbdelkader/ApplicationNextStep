from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import jwt
from flask_cors import CORS
import os

app = Flask(__name__)

mongo_uri = os.getenv('MONGO_URI')
secret_key = os.getenv('SECRET_KEY')

app.config['MONGO_URI'] = mongo_uri
app.config['SECRET_KEY'] = secret_key

CORS(app, resources={r"/*": {"origins": "http://10.9.21.20:30090"}})

mongo = PyMongo(app)
products_collection = mongo.db.products

def seed_data():
    if products_collection.count_documents({}) == 0:
        products_collection.insert_many([
            {'name': 'Product 1', 'price': 10, 'description': 'Un produit exceptionnel'},
            {'name': 'Product 2', 'price': 20, 'description': 'Un produit innovant'},
            {'name': 'Product 3', 'price': 30, 'description': 'Un produit de qualité'}
        ])
        print("✅ Données initiales insérées.")
    else:
        print("✅ Données déjà présentes.")

@app.route('/products', methods=['GET'])
def get_products():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'message': 'Token is missing!'}), 403

    try:
        parts = auth_header.split()
        if parts[0].lower() != 'bearer' or len(parts) != 2:
            return jsonify({'message': 'Invalid Authorization header format'}), 403
        token = parts[1]
        jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except Exception as e:
        return jsonify({'message': f'Token is invalid! {str(e)}'}), 403

    products = []
    for product in products_collection.find({}):
        product['_id'] = str(product['_id'])
        products.append(product)

    return jsonify({'products': products})

if __name__ == '__main__':
    seed_data()
    app.run(host='0.0.0.0', port=5001)
