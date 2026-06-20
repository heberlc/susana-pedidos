import { ShoppingCart, Package } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';

interface HeaderProps {
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const cart = useOrderStore((s) => s.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-gray-200 px-4 py-4" role="banner">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-8 h-8 text-sky-600" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-gray-900">Pedidos Susana</h1>
        </div>
        <button
          onClick={onCartClick}
          className="relative p-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors min-h-14 min-w-14 flex items-center justify-center"
          aria-label={`Abrir carrito de compras. ${totalItems > 0 ? `${totalItems} productos en el carrito` : 'Carrito vacío'}`}
        >
          <ShoppingCart className="w-7 h-7" aria-hidden="true" />
          {totalItems > 0 && (
            <span 
              className="absolute -top-1 -right-1 bg-red-500 text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center"
              aria-hidden="true"
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
