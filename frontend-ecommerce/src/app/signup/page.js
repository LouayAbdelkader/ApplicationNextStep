'use client';
import { useState } from 'react';
import { signup } from '../../services/api';
import { useRouter } from 'next/navigation';
import '../style.css'; // ✅ Import du fichier CSS partagé

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(formData);
      if (res.status === 201 || res.status === 200) {
        alert('Inscription réussie ! Connectez-vous.');
        router.push('/login');
      }
    } catch (err) {
      alert("Erreur lors de l'inscription");
      console.error(err);
    }
  };

  return (
    <main className="center-container">
      <div className="card">
        <img src="/LogoNextStepIT.png" alt="Logo" className="logo" />
        <h1 className="title">Créer un compte</h1>
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
            S'inscrire
          </button>
        </form>
        <div style={{ textAlign: 'center' }}>
          <button
            className="link-button"
            onClick={() => router.push('/login')}
          >
            Déjà un compte ? Connectez-vous ici
          </button>
        </div>
      </div>
    </main>
  );
}
