import unittest
import json
import jwt
import datetime
from app import app, users_collection

def generate_token(username, exp=None):
    payload = {'username': username}
    if exp:
        payload['exp'] = exp
    else:
        payload['exp'] = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

class TestUserService(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        users_collection.delete_many({})

    def test_register_success(self):
        r = self.app.post('/register', json={'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.json['message'], 'User registered successfully')

    def test_register_duplicate(self):
        self.app.post('/register', json={'username': 'testuser', 'password': 'testpass'})
        r = self.app.post('/register', json={'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(r.status_code, 409)
        self.assertEqual(r.json['message'], 'User already exists')

    def test_login_success(self):
        self.app.post('/register', json={'username': 'testuser', 'password': 'testpass'})
        r = self.app.post('/login', json={'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(r.status_code, 200)
        self.assertIn('token', r.json)

    def test_login_invalid_credentials(self):
        r = self.app.post('/login', json={'username': 'nonexistent', 'password': 'wrong'})
        self.assertEqual(r.status_code, 401)
        self.assertEqual(r.json['message'], 'Invalid credentials')

    def test_register_missing_fields(self):
        r = self.app.post('/register', data=json.dumps({}), content_type='application/json')
        self.assertEqual(r.status_code, 400)

    def test_login_missing_fields(self):
        r = self.app.post('/login', data=json.dumps({}), content_type='application/json')
        self.assertEqual(r.status_code, 400)

    def test_profile_success(self):
        # Register and login to get a token
        self.app.post('/register', json={'username': 'testuser', 'password': 'testpass'})
        r = self.app.post('/login', json={'username': 'testuser', 'password': 'testpass'})
        token = r.json['token']
        headers = {'Authorization': f'Bearer {token}'}
        r = self.app.get('/profile', headers=headers)
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json['username'], 'testuser')
        self.assertEqual(r.json['message'], 'Profile data fetched successfully')

    def test_profile_expired_token(self):
        expired_time = datetime.datetime.utcnow() - datetime.timedelta(seconds=10)
        token = generate_token('testuser', exp=expired_time)
        headers = {'Authorization': f'Bearer {token}'}
        r = self.app.get('/profile', headers=headers)
        self.assertEqual(r.status_code, 401)
        self.assertEqual(r.json['message'], 'Token has expired!')

    def test_profile_invalid_token(self):
        headers = {'Authorization': 'Bearer invalidtoken'}
        r = self.app.get('/profile', headers=headers)
        self.assertEqual(r.status_code, 401)
        self.assertEqual(r.json['message'], 'Invalid token!')

    def test_profile_missing_token(self):
        r = self.app.get('/profile')
        self.assertEqual(r.status_code, 401)
        self.assertEqual(r.json['message'], 'Token is missing!')

if __name__ == '__main__':
    unittest.main()