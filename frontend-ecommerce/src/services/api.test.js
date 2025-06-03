import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as api from './api';

const mock = new MockAdapter(axios);

describe('API service', () => {
  beforeEach(() => {
    mock.reset();
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('signup should send POST request with formData', async () => {
    const formData = { username: 'user', password: 'pass' };
    const responseData = { message: 'User created' };

    mock.onPost('http://10.9.21.20:30050/register').reply(201, responseData);

    const response = await api.signup(formData);
    expect(response.status).toBe(201);
    expect(response.data).toEqual(responseData);
  });

  test('login should store token and return full response', async () => {
    const formData = { username: 'user', password: 'pass' };
    const mockToken = 'mocked.jwt.token';

    mock.onPost('http://10.9.21.20:30050/login').reply(200, { token: mockToken });

    const response = await api.login(formData);

    expect(localStorage.getItem('token')).toBe(mockToken);
    expect(response.status).toBe(200);
    expect(response.data.token).toBe(mockToken);
  });

  test('login should throw error if request fails', async () => {
    const formData = { username: 'baduser', password: 'wrongpass' };
    mock.onPost('http://10.9.21.20:30050/login').reply(401, { message: 'Unauthorized' });

    await expect(api.login(formData)).rejects.toThrow();
  });

  test('getProfile should return user data with token in header', async () => {
    const token = 'valid.token';
    localStorage.setItem('token', token);

    const profileData = { id: 1, name: 'John Doe' };

    mock.onGet('http://10.9.21.20:30050/profile').reply(config => {
      expect(config.headers.Authorization).toBe(`Bearer ${token}`);
      return [200, profileData];
    });

    const response = await api.getProfile();
    expect(response.status).toBe(200);
    expect(response.data).toEqual(profileData);
  });

  test('logout should clear token and username from localStorage', () => {
    localStorage.setItem('token', '123');
    localStorage.setItem('username', 'john');

    api.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('username')).toBeNull();
  });

  test('getProducts should return product list with Authorization header', async () => {
    const token = 'product.token';
    const products = [{ id: 1, name: 'Product 1' }];
    localStorage.setItem('token', token);

    mock.onGet('http://10.9.21.20:30051/products').reply(config => {
      expect(config.headers.Authorization).toBe(`Bearer ${token}`);
      return [200, products];
    });

    const response = await api.getProducts();
    expect(response.status).toBe(200);
    expect(response.data).toEqual(products);
  });
});
