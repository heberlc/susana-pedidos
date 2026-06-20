import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { formatCurrency } from '../utils/formatters';
import { Button } from './ui/Button';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose, onCheckout }) => {
  const cart = useOrderStore((s) => s.cart);
  const removeItem = useOrderStore((s) => s.removeItem);
  const updateQuantity = useOrderStore((s) => s.updateQuantity);
  const clearCart = useOrderStore((s) => s.clearCart);
  const getSubtotal = useOrderStore((s) => s.getSubtotal);
  const getTotalBoxes = useOrderStore((s) => s.getTotalBoxes);

  const subtotal = getSubtotal();
  const totalBoxes = getTotalBoxes();

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside 
        className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between p-5 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-sky-600" aria-hidden="true" />
            <h2 className="text-2xl font-bold text-gray-900">Mi Pedido</h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl min-h-14 min-w-14 flex items-center justify-center"
            aria-label="Cerrar carrito"
          >
            <X className="w-7 h-7" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" aria-hidden="true" />
              <p className="text-2xl font-bold mb-2">Tu carrito está vacío</p>
              <p className="text-lg">Agrega productos del catálogo</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-gray-50 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                      {item.product.name}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors min-h-12 min-w-12 flex items-center justify-center"
                      aria-label={`Eliminar ${item.product.name} del carrito`}
                    >
                      <Trash2 className="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-100 min-h-12 min-w-12 flex items-center justify-center"
                        aria-label={`Reducir cantidad de ${item.product.name}`}
                      >
                        <Minus className="w-5 h-5" aria-hidden="true" />
                      </button>
                      <span 
                        className="w-12 text-center text-xl font-bold"
                        aria-label={`${item.quantity} cajas`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-3 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-100 min-h-12 min-w-12 flex items-center justify-center"
                        aria-label={`Aumentar cantidad de ${item.product.name}`}
                      >
                        <Plus className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                    <span className="text-xl font-bold text-sky-700">
                      {formatCurrency(item.product.packPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t-2 border-gray-200 p-5 space-y-4 bg-gray-50">
            <div className="flex items-center justify-between text-lg text-gray-700">
              <span className="font-semibold">{totalBoxes} cajas en total</span>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-semibold text-lg p-2 min-h-11 flex items-center"
                aria-label="Limpiar todo el carrito"
              >
                Limpiar todo
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-sky-700">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <Button onClick={onCheckout} className="w-full" size="lg">
              Continuar al pedido
            </Button>
          </div>
        )}
      </aside>
    </>
  );
};
