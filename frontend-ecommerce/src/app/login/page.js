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
        localStorage.setItem('username', profile.data.username);
        alert(`Bienvenue ${profile.data.username} !`);
        router.push('/');
      }
    } catch (err) {
      alert("Erreur lors de la connexion");
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="w-full max-w-md p-8 bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-md">
        <div className="flex flex-col items-center mb-6">
          <img src="/LogoNextStepIT.png" alt="Logo" className="h-16 mb-4" />
          <h1 className="text-2xl font-bold text-center">Se connecter</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-[var(--border)] bg-transparent text-[var(--foreground)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded border border-[var(--border)] bg-transparent text-[var(--foreground)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
          >
            Se connecter
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Pas encore de compte ?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="text-blue-400 underline hover:text-blue-300"
          >
            Inscrivez-vous ici
          </button>
        </p>
      </div>
    </main>
  );
}
