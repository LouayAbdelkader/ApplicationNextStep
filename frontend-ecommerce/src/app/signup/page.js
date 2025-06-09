'use client';
import { useState } from 'react';
import { signup } from '../../services/api';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const router = useRouter();

  const styles = {
    page: {
      backgroundColor: '#1f1830',
      color: '#ededed',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      padding: '2rem',
      backgroundColor: '#1f1830',
      border: '1px solid #3d2d54',
      borderRadius: '1rem',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)',
    },
    logo: {
      height: '64px',
      marginBottom: '1.5rem',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    title: {
      textAlign: 'center',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      marginBottom: '1rem',
      border: '1px solid #3d2d54',
      borderRadius: '0.5rem',
      backgroundColor: 'transparent',
      color: '#ededed',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#ffffff',
      color: '#000000',
      fontWeight: 'bold',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
    },
    link: {
      textAlign: 'center',
      marginTop: '1.5rem',
      fontSize: '0.9rem',
      color: '#90cdf4',
      textDecoration: 'underline',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    },
  };

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
    <main style={styles.page}>
      <div style={styles.card}>
        <img src="/LogoNextStepIT.png" alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>Créer un compte</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            S'inscrire
          </button>
        </form>
        <div style={{ textAlign: 'center' }}>
          <button
            style={styles.link}
            onClick={() => router.push('/login')}
          >
            Déjà un compte ? Connectez-vous ici
          </button>
        </div>
      </div>
    </main>
  );
}
