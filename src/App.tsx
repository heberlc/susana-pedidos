import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { CartDrawer } from './components/CartDrawer';
import { OrderForm } from './components/OrderForm';

type View = 'catalogo' | 'pedido';

function App() {
  const [view, setView] = useState<View>('catalogo');
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as View;
      if (hash === 'pedido') setView('pedido');
      else setView('catalogo');
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (newView: View) => {
    window.location.hash = newView;
    setView(newView);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-sky-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:text-lg focus:font-semibold"
      >
        Saltar al contenido principal
      </a>
      
      <Header onCartClick={() => setCartOpen(true)} />

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-6" role="main">
        {view === 'catalogo' ? (
          <ProductList />
        ) : (
          <OrderForm onBack={() => navigate('catalogo')} />
        )}
      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          navigate('pedido');
        }}
      />
    </div>
  );
}

export default App;
