'use client';

import { useState } from 'react';
import { signup } from '../../services/api';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground font-sans">
      <div className="w-full max-w-md p-8 bg-background border border-foreground/20 rounded-xl shadow-lg flex flex-col items-center">
        {/* Logo centré */}
        <img
          src="/LogoNextStepIT.png"  // Remplace par le chemin de ton image
          alt="Logo de l'entreprise"
          className="h-16 mb-6"
        />
        
        <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>
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
          <button
            type="submit"
            className="w-full p-3 bg-foreground text-background rounded hover:bg-foreground/80 transition cursor-pointer"
          >
            S'inscrire
          </button>
        </form>
        <p className="text-center mt-4">
          Déjà un compte ?{' '}
          <button
            className="text-blue-400 underline cursor-pointer"
            onClick={() => router.push('/login')}
          >
            Connectez-vous ici
          </button>
        </p>
      </div>
    </main>
  );
}
