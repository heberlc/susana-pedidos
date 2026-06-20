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
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-500" />
            <h2 className="text-lg font-semibold">Mi Pedido</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg">Tu carrito está vacío</p>
              <p className="text-sm mt-1">Agrega productos del catálogo</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="bg-gray-50 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
                      {item.product.name}
                    </p>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-1 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-sky-600">
                      {formatCurrency(item.product.packPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{totalBoxes} cajas</span>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Limpiar todo
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold text-sky-600">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <Button onClick={onCheckout} className="w-full" size="lg">
              Continuar al pedido
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
