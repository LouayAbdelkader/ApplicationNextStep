'use client';
import { useState } from 'react';
import { login, getProfile } from '../../services/api';
import { useRouter } from 'next/navigation';
import '../style.css'; // ✅ Import du fichier CSS partagé

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      if (res.status === 200) {
        const profile = await getProfile();
        localStorage.setItem('username', profile.data.username);
        alert(`Bienvenue ${profile.data.username} !`);
        router.push('/');
      }
    } catch (err) {
      alert('Erreur lors de la connexion');
      console.error(err);
    }
  };

  return (
    <main className="center-container">
      <div className="card">
        <img src="/LogoNextStepIT.png" alt="Logo" className="logo" />
        <h1 className="title">Se connecter Test de Modification vers end users !</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            className="input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="input"
            required
          />
          <button type="submit" className="button">
            Se connecter
          </button>
        </form>
        <div style={{ textAlign: 'center' }}>
          <button
            className="link-button"
            onClick={() => router.push('/signup')}
          >
            Pas encore de compte ? Inscrivez-vous ici
          </button>
        </div>
      </div>
    </main>
  );
}
