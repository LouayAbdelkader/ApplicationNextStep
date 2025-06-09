'use client';
import { useEffect, useState } from 'react';
import { getProducts, logout } from '../services/api';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#1f1830',
      color: '#ededed',
      fontFamily: 'Arial, sans-serif',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      borderBottom: '1px solid #333',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    },
    logoBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    logo: {
      width: '32px',
      height: '32px',
      backgroundColor: '#3182ce',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1rem',
    },
    logout: {
      backgroundColor: '#f0f0f0',
      color: '#1a202c',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
    },
    main: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    heading: {
      textAlign: 'center',
      fontSize: '2rem',
      marginBottom: '2rem',
    },
    grid: {
      display: 'grid',
      gap: '1.5rem',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    },
    card: {
      backgroundColor: '#1e1e1e',
      border: '1px solid #444',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    footer: {
      textAlign: 'center',
      padding: '2rem',
      borderTop: '1px solid #333',
      color: '#aaa',
      marginTop: '4rem',
    },
  };

  useEffect(() => {
    const stored = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    if (!token) {
      logout();
      router.push('/login');
      return;
    }

    if (stored) setUsername(stored);

    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        setProducts(res.data.products || []);
      } catch (err) {
        setError("Erreur lors du chargement des produits.");
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.logoBox}>
          <div style={styles.logo}>NS</div>
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>NextStep Store</span>
        </div>
        {username && (
          <div>
            <span style={{ marginRight: '1rem' }}>👋 {username}</span>
            <button onClick={handleLogout} style={styles.logout}>
              Se déconnecter
            </button>
          </div>
        )}
      </nav>

      <main style={styles.main}>
        <h2 style={styles.heading}>Catalogue Produits</h2>

        {loading && <p style={{ textAlign: 'center' }}>Chargement...</p>}
        {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <div style={styles.grid}>
            {products.map((product) => (
              <div key={product._id} style={styles.card}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{product.name}</h3>
                  <p style={{ color: '#aaa' }}>{product.description}</p>
                </div>
                <p style={{ marginTop: '1rem', fontWeight: 'bold', color: '#63b3ed' }}>
                  {product.price} €
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        &copy; 2024 NextStepIT Store. Tous droits réservés.
      </footer>
    </div>
  );
}
