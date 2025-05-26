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
        localStorage.setItem('username', username); // 🔥 Stocke le nom d'utilisateur

        alert(`Bienvenue ${username} !`);
        router.push('/'); // 🔁 Redirection OK
      }
    } catch (err) {
      alert("Erreur lors de la connexion");
      console.error(err);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground font-sans">
      <div className="w-full max-w-md p-8 bg-background border border-foreground/20 rounded-xl shadow-lg flex flex-col items-center">
        <img src="/LogoNextStepIT.png" alt="Logo de l'entreprise" className="h-16 mb-6" />
        <h1 className="text-2xl font-bold mb-6 text-center">Se connecter</h1>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 bg-background border border-foreground/40 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-background border border-foreground/40 rounded"
            required
          />
          <button type="submit" className="w-full p-3 bg-foreground text-background rounded hover:bg-foreground/80 transition cursor-pointer">
            Se connecter
          </button>
        </form>
        <p className="text-center mt-4">
          Pas encore de compte ?{' '}
          <button className="text-blue-400 underline" onClick={() => router.push('/signup')}>
            Inscrivez-vous ici
          </button>
        </p>
      </div>
    </main>
  );
}
