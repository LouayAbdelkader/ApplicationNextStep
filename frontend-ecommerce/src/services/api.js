import axios from 'axios';

const USER_SERVICE_URL = 'http://10.9.21.20:30050';
const PRODUCT_SERVICE_URL = 'http://10.9.21.20:30051';

export const signup = (formData) => {
  return axios.post(`${USER_SERVICE_URL}/register`, formData);
};

export const login = async (formData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/login`, formData);
    const token = response.data.token;
    localStorage.setItem('token', token);
    return response; // 🔥 CORRECTION : on retourne la réponse complète
  } catch (error) {
    throw error;
  }
};

export const getProfile = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${USER_SERVICE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};

export const getProducts = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${PRODUCT_SERVICE_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
