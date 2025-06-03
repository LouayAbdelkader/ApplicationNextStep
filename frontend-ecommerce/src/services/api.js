import axios from 'axios';

const USER_SERVICE_URL = 'http://10.9.21.20:30050';
const PRODUCT_SERVICE_URL = 'http://10.9.21.20:30051';

// Fonction d'inscription
export const signup = (formData) => {
  return axios.post(`${USER_SERVICE_URL}/register`, formData);
};

// Fonction de connexion avec gestion d'erreur améliorée
export const login = async (formData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/login`, formData);
    const token = response.data.token;
    localStorage.setItem('token', token);
    return response; // 🔥 CORRECTION : on retourne la réponse complète
  } catch (error) {
    console.error("Login failed:", error.message);
    throw new Error("Échec de la connexion. Veuillez vérifier vos identifiants.");
  }
};

// Récupérer le profil utilisateur
export const getProfile = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${USER_SERVICE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Déconnexion de l'utilisateur
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};

// Récupérer les produits
export const getProducts = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${PRODUCT_SERVICE_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
