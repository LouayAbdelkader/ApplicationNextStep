'use client';

import { useState } from 'react';
import { login, getProfile } from '../../services/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      if (res.status === 200) {
        const profile = await getProfile();
        const username = profile.data.username;
        localStorage.setItem('username', username);
        alert(`Bienvenue ${username} !`);
        router.push('/');
      }
    } catch (err) {
      alert("Erreur lors de la connexion");
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)] font-sans">
      <div className="w-full max-w-md p-8 bg-[var(--color-background)] border border-[var(--color-foreground)]/20 rounded-xl shadow-xl">
        <div className="flex flex-col items-center">
          <img src="/LogoNextStepIT.png" alt="Logo" className="h-16 mb-6" />
          <h1 className="text-2xl font-bold mb-6 text-center">Se connecter</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-[var(--color-foreground)]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-transparent border border-[var(--color-foreground)]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-[var(--color-foreground)] text-[var(--color-background)] rounded-md hover:bg-opacity-80 transition"
          >
            Se connecter
          </button>
        </form>
        <p className="text-center mt-6">
          Pas encore de compte ?{' '}
          <button
            className="text-blue-400 underline hover:text-blue-300"
            onClick={() => router.push('/signup')}
          >
            Inscrivez-vous ici
          </button>
        </p>
      </div>
    </main>
  );
}
