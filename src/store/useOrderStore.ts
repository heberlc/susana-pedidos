import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Order } from '../types';

interface OrderState {
  cart: CartItem[];
  customerName: string;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCustomerName: (name: string) => void;
  getSubtotal: () => number;
  getTotalBoxes: () => number;
  getOrder: () => Order | null;
  resetOrder: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      cart: [],
      customerName: 'Susana',

      addItem: (product: Product) => {
        const { cart } = get();
        const existing = cart.find((item) => item.productId === product.id);
        if (existing) {
          set({
            cart: cart.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { productId: product.id, product, quantity: 1 }] });
        }
      },

      removeItem: (productId: string) => {
        set({ cart: get().cart.filter((item) => item.productId !== productId) });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      setCustomerName: (name: string) => set({ customerName: name }),

      getSubtotal: () => {
        return get().cart.reduce(
          (sum, item) => sum + item.product.packPrice * item.quantity,
          0
        );
      },

      getTotalBoxes: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      getOrder: () => {
        const { cart, customerName } = get();
        if (cart.length === 0) return null;

        const subtotal = get().getSubtotal();
        const totalBoxes = get().getTotalBoxes();

        return {
          id: `order-${Date.now()}`,
          supplierId: cart[0]?.product.supplier || '',
          items: [...cart],
          customer: { name: customerName },
          subtotal,
          totalBoxes,
          createdAt: new Date().toISOString(),
        };
      },

      resetOrder: () => set({ cart: [], customerName: 'Susana' }),
    }),
    {
      name: 'pedidos-susana-storage',
      partialize: (state) => ({
        cart: state.cart,
        customerName: state.customerName,
      }),
    }
  )
);
