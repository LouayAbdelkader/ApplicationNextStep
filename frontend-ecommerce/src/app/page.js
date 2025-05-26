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
      setLoading(true);
      setError(null); 
      try {
        const res = await getProducts();
        setProducts(res.data.products || []); 
      } catch (err) {
        console.error('Erreur lors de la récupération des produits :', err);
        setError("Impossible de charger les produits."); 
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            setError("Session expirée. Veuillez vous reconnecter.");
            handleLogout(); 
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [router]); 

  const handleLogout = () => {
    logout(); 
    router.push('/login'); 
  };

  return (
    // 👇 Fond principal très sombre, texte blanc par défaut
    <div className="min-h-screen bg-[#1f1830] text-white font-sans"> 
      
      {/* Barre de navigation */}
      <nav className="w-full flex justify-between items-center p-5 mb-8 border-b border-gray-800 shadow-lg">
        {/* Logo (similaire à celui de l'image) - à adapter avec votre vrai logo */}
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-lg">
                NS 
            </div>
            <span className="font-semibold text-xl">NextStep Store</span>
        </div>

        <div className="flex items-center space-x-4">
            {/* Message de bienvenue */}
            <span className="text-gray-300">
              {username ? `👋 Bienvenue @${username}` : 'Bienvenue !'}
            </span>

            {/* Bouton de déconnexion (style clair comme demandé) */}
            {username && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-white transition duration-200 shadow"
              >
                Se déconnecter
              </button>
            )}
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="container mx-auto p-4">
        <h2 className="text-4xl font-bold mb-10 text-center text-gray-100">Catalogue Produits</h2>

        {loading && <p className="text-center text-gray-400 text-lg">Chargement des produits...</p>}
        
        {error && <p className="text-center text-red-400 font-medium text-lg">{error}</p>}

        {!loading && !error && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              // 👇 Cartes produits avec le thème sombre
              <div 
                key={product._id} 
                className="bg-[#1e1e1e] border border-gray-700 p-6 rounded-xl shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-3">{product.name}</h3>
                  <p className="text-gray-400 mb-5">{product.description}</p>
                </div>
                <p className="mt-2 font-bold text-blue-400 text-xl">{product.price} €</p>
              </div>
            ))}
          </div>
        ) : (
          !loading && !error && <p className="text-center text-gray-500 text-lg">Aucun produit à afficher pour le moment.</p>
        )}
      </main>

      {/* Pied de page optionnel */}
      <footer className="text-center p-6 mt-16 text-gray-600 border-t border-gray-800">
          &copy; 2024 NextStepIT Store. Tous droits réservés.
      </footer>
    </div>
  );
}