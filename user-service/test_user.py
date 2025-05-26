import unittest
import json
from app import app, users_collection

class TestUserService(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        users_collection.delete_many({})

    def test_register_success(self):
        r = self.app.post('/register', json={'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(r.status_code, 201)  # Correction ici
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

if __name__ == '__main__':
    unittest.main()
