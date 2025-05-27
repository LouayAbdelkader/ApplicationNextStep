import unittest
import json
from unittest.mock import patch
import jwt
import datetime
from flask import Flask
from app import app, users_collection

class TestUserService(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True
        users_collection.delete_many({})
        self.secret_key = app.config['SECRET_KEY']

    def test_register_success(self):
        response = self.app.post('/register', json={'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json['message'], 'User registered successfully')

    def test_register_duplicate(self):
        self.app.post('/register', json={'username': 'testuser', 'password': 'testpass'})
        response = self.app.post('/register', json={'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.json['message'], 'User already exists')

    def test_register_missing_username(self):
        response = self.app.post('/register', json={'password': 'testpass'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['message'], 'Invalid request')

    def test_register_missing_password(self):
        response = self.app.post('/register', json={'username': 'testuser'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['message'], 'Invalid request')

    def test_register_malformed_json(self):
        response = self.app.post('/register', data="invalid json", content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_login_success(self):
        self.app.post('/register', json={'username': 'testuser', 'password': 'testpass'})
        response = self.app.post('/login', json={'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.json)

    def test_login_invalid_credentials(self):
        response = self.app.post('/login', json={'username': 'nonexistent', 'password': 'wrong'})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json['message'], 'Invalid credentials')

    def test_login_missing_username(self):
        response = self.app.post('/login', json={'password': 'testpass'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['message'], 'Invalid credentials')

    def test_login_missing_password(self):
        response = self.app.post('/login', json={'username': 'testuser'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json['message'], 'Invalid credentials')

    def test_login_malformed_json(self):
        response = self.app.post('/login', data="invalid json", content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_profile_success(self):
        # Register and login to get a valid token
        self.app.post('/register', json={'username': 'testuser', 'password': 'testpass'})
        login_response = self.app.post('/login', json={'username': 'testuser', 'password': 'testpass'})
        token = login_response.json['token']
        
        # Test profile endpoint
        response = self.app.get('/profile', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['username'], 'testuser')
        self.assertEqual(response.json['message'], 'Profile data fetched successfully')

    def test_profile_no_token(self):
        response = self.app.get('/profile')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json['message'], 'Token is missing!')

    def test_profile_invalid_token(self):
        response = self.app.get('/profile', headers={'Authorization': 'Bearer invalidtoken'})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json['message'], 'Invalid token!')

    def test_profile_expired_token(self):
        # Create an expired token
        expired_token = jwt.encode(
            {'username': 'testuser', 'exp': datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=1)},
            self.secret_key,
            algorithm='HS256'
        )
        response = self.app.get('/profile', headers={'Authorization': f'Bearer {expired_token}'})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json['message'], 'Token has expired!')

    def test_profile_user_not_found(self):
        # Create a token for a non-existent user
        token = jwt.encode(
            {'username': 'nonexistent', 'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)},
            self.secret_key,
            algorithm='HS256'
        )
        response = self.app.get('/profile', headers={'Authorization': f'Bearer {token}'})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json['message'], 'User not found!')

    def test_profile_invalid_auth_header(self):
        response = self.app.get('/profile', headers={'Authorization': 'InvalidHeader'})
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json['message'], 'Token is missing!')

    def test_cors_headers(self):
        response = self.app.post('/register', json={'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(response.status_code, 201)
        self.assertIn('Access-Control-Allow-Origin', response.headers)
        self.assertEqual(response.headers['Access-Control-Allow-Origin'], 'http://10.9.21.20:30090')

if __name__ == '__main__':
    unittest.main()
