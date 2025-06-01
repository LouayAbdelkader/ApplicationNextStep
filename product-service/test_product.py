import unittest
import jwt
import datetime
from app import app, products_collection, seed_data

def generate_token(exp=None):
    payload = {'username': 'testuser'}
    if exp:
        payload['exp'] = exp
    else:
        payload['exp'] = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

class TestProductService(unittest.TestCase):

    def setUp(self):
        self.client = app.test_client()
        products_collection.delete_many({})
        products_collection.insert_many([
            {'name': 'Product 1', 'price': 10, 'description': 'Un produit exceptionnel'},
            {'name': 'Product 2', 'price': 20, 'description': 'Un produit innovant'},
            {'name': 'Product 3', 'price': 30, 'description': 'Un produit de qualité'}
        ])

    def test_get_products_without_token(self):
        response = self.client.get('/products')
        self.assertEqual(response.status_code, 403)
        self.assertIn('Token is missing', response.get_json()['message'])

    def test_get_products_invalid_token(self):
        headers = {'Authorization': 'Bearer invalidtoken'}
        response = self.client.get('/products', headers=headers)
        self.assertEqual(response.status_code, 403)
        self.assertIn('Token is invalid', response.get_json()['message'])

    def test_get_products_invalid_format(self):
        headers = {'Authorization': 'InvalidHeaderFormat'}
        response = self.client.get('/products', headers=headers)
        self.assertEqual(response.status_code, 403)
        self.assertIn('Invalid Authorization header format', response.get_json()['message'])

    def test_get_products_token_expired(self):
        expired_time = datetime.datetime.utcnow() - datetime.timedelta(seconds=10)
        token = generate_token(exp=expired_time)
        headers = {'Authorization': f'Bearer {token}'}
        response = self.client.get('/products', headers=headers)
        self.assertEqual(response.status_code, 403)
        self.assertIn('Token is invalid', response.get_json()['message'])

    def test_get_products_success(self):
        token = generate_token()
        headers = {'Authorization': f'Bearer {token}'}
        response = self.client.get('/products', headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('products', data)
        self.assertIsInstance(data['products'], list)
        self.assertEqual(len(data['products']), 3)
        first_product = data['products'][0]
        self.assertEqual(first_product['name'], 'Product 1')
        self.assertEqual(first_product['price'], 10)
        self.assertEqual(first_product['description'], 'Un produit exceptionnel')

    def test_seed_data_function(self):
        products_collection.delete_many({})
        seed_data()
        count = products_collection.count_documents({})
        self.assertEqual(count, 3)
        product2 = products_collection.find_one({'name': 'Product 2'})
        self.assertIsNotNone(product2)
        self.assertEqual(product2['price'], 20)

    def test_get_products_empty_collection(self):
        products_collection.delete_many({})
        token = generate_token()
        headers = {'Authorization': f'Bearer {token}'}
        response = self.client.get('/products', headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data['products']), 0)

if __name__ == '__main__':
    unittest.main()