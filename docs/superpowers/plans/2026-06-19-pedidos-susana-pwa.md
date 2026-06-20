# Pedidos Susana - WhatsApp Order PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a PWA that lets Susana create product orders from a catalog and send them via WhatsApp to suppliers using a pre-filled message format.

**Architecture:** Single-page React application with hash-based routing. Products stored as static JSON data. Zustand manages cart state with localStorage persistence. WhatsApp integration via `wa.me/?text=` deep links with URL-encoded messages.

**Tech Stack:** React 19 + Vite 8 + TypeScript 6 + Tailwind CSS v4.3 + Zustand 5.0.12 + React Hook Form 7.77 + vite-plugin-pwa

## Global Constraints

- Node.js 18+ required
- React 19.2.x, Vite 8.0.x, TypeScript 6.0.x
- @vitejs/plugin-react 6.0.x
- Tailwind CSS 4.3.x with @tailwindcss/vite (NOT v3 - different config approach)
- Zustand 5.0.12 (persist middleware)
- React Hook Form 7.77.x
- PWA must work offline for product browsing
- Currency: Soles (S/)
- Single supplier: AJEPER S.A (MVP)
- Customer name only (default: "Susana")
- WhatsApp: `wa.me/?text=` format (no fixed phone numbers)
- Message format: "Hola, me comunico de parte de [Customer Name] para realizar el siguiente pedido: ..."

## File Structure

```
pedidos-susana/
├── public/
│   └── icons/                        # PWA icons (192, 512, maskable)
├── src/
│   ├── data/
│   │   ├── products.ts               # Parsed product data + types
│   │   └── suppliers.ts              # Supplier config
│   ├── store/
│   │   └── useOrderStore.ts          # Zustand store (cart, customer, order)
│   ├── components/
│   │   ├── ProductCard.tsx           # Product display + add to cart
│   │   ├── ProductList.tsx           # Filterable/searchable grid
│   │   ├── CartDrawer.tsx            # Slide-out cart with qty controls
│   │   ├── OrderForm.tsx             # Customer details + validation
│   │   ├── WhatsAppButton.tsx        # Deep link generator
│   │   ├── Header.tsx                # App header with cart badge
│   │   └── ui/
│   │       └── Button.tsx            # Reusable button component
│   ├── hooks/
│   │   └── useWhatsApp.ts            # Message formatting + navigation
│   ├── utils/
│   │   ├── formatters.ts             # Currency, phone formatting
│   │   └── constants.ts              # App config, message template
│   ├── types/
│   │   └── index.ts                  # Shared TypeScript interfaces
│   ├── styles/
│   │   └── globals.css               # Tailwind v4 imports + custom styles
│   ├── App.tsx                       # Main layout + routing
│   ├── main.tsx                      # Entry point
│   └── vite-env.d.ts                 # Vite type declarations
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── package.json
```

---

## Task 1: Project Scaffold + Dependencies

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/vite-env.d.ts`

**Interfaces:**
- Consumes: None (initial setup)
- Produces: Working Vite dev server with React + TypeScript + Tailwind

- [ ] **Step 1: Initialize project**

```bash
npm create vite@latest . -- --template react-ts
```

Select: React, TypeScript

- [ ] **Step 2: Install core dependencies**

```bash
npm install zustand@^5.0.12 react-hook-form@^7.77 lucide-react date-fns
```

- [ ] **Step 3: Install Tailwind CSS v4**

```bash
npm install tailwindcss@latest @tailwindcss/vite@latest
```

- [ ] **Step 4: Configure vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

- [ ] **Step 5: Configure globals.css**

```css
@import "tailwindcss";

@theme {
  --color-primary: #0ea5e9;
  --color-primary-hover: #0284c7;
  --color-primary-light: #e0f2fe;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

- [ ] **Step 6: Run dev server to verify**

```bash
npm run dev
```

Expected: Browser opens, shows React default page with Tailwind styles

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: scaffold project with React 19 + Vite 8 + TypeScript 6 + Tailwind v4.3"
```

---

## Task 2: Type Definitions + Data Layer

**Files:**
- Create: `src/types/index.ts`, `src/data/products.ts`, `src/data/suppliers.ts`

**Interfaces:**
- Consumes: None
- Produces: `Product`, `Supplier`, `CartItem`, `CustomerInfo`, `Order`, `OrderFormData` types; `PRODUCTS` array; `SUPPLIERS` array

- [ ] **Step 1: Create types/index.ts**

```typescript
export interface Product {
  id: string;
  supplier: string;
  supplierCode: string;
  name: string;
  unitsPerBox: number;
  unitPrice: number;
  packPrice: number;
  category: ProductCategory;
}

export type ProductCategory = 'agua' | 'gaseosa' | 'energizante' | 'jugo' | 'deporte' | 'otro';

export interface Supplier {
  id: string;
  name: string;
  displayName: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
}

export interface Order {
  id: string;
  supplierId: string;
  items: CartItem[];
  customer: CustomerInfo;
  subtotal: number;
  totalBoxes: number;
  createdAt: string;
}

export interface OrderFormData {
  supplierId: string;
  customerName: string;
}
```

- [ ] **Step 2: Create data/products.ts**

```typescript
import type { Product, ProductCategory } from '../types';

const categorize = (name: string): ProductCategory => {
  const upper = name.toUpperCase();
  if (upper.includes('AGUA') || upper.includes('CIELO')) return 'agua';
  if (upper.includes('COLA') || upper.includes('KR') || upper.includes('BIG') || upper.includes('ORO') || upper.includes('CIFRUT')) return 'gaseosa';
  if (upper.includes('VOLT') || upper.includes('SPORADE')) return 'energizante';
  if (upper.includes('PULP') || upper.includes('NARANJA') || upper.includes('LIMON') || upper.includes('MANZANA') || upper.includes('MARACUYA')) return 'jugo';
  if (upper.includes('BIO')) return 'deporte';
  return 'otro';
};

const rawProducts = [
  { supplier: 'AJEPER S.A', code: '608469', name: 'AGUA CIELO SIN GAS 1000 ml PET 6 pack', units: 6, unitPrice: 1.67, packPrice: 10.00 },
  { supplier: 'AJEPER S.A', code: '608462', name: 'AGUA CIELO SIN GAS 625 ml PET 15 pack', units: 15, unitPrice: 0.80, packPrice: 12.00 },
  { supplier: 'AJEPER S.A', code: '699664', name: 'BIG COLA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.80, packPrice: 12.00 },
  { supplier: 'AJEPER S.A', code: '622089', name: 'BIO ALOE 520 ML PET 12 PACK', units: 12, unitPrice: 2.61, packPrice: 31.28 },
  { supplier: 'AJEPER S.A', code: '624285', name: 'CIELO AGUA NARANJA PET NO RETORNABLE 600 ML 12', units: 12, unitPrice: 1.17, packPrice: 14.00 },
  { supplier: 'AJEPER S.A', code: '623835', name: 'CIELO LIMON PET NO RETORNABLE 600 ML 12 MC', units: 12, unitPrice: 1.17, packPrice: 14.00 },
  { supplier: 'AJEPER S.A', code: '623836', name: 'CIELO MANZANA PET NO RETORNABLE 600 ML 12 MC', units: 12, unitPrice: 1.17, packPrice: 14.00 },
  { supplier: 'AJEPER S.A', code: '623840', name: 'CIELO MARACUYA PET NO RETORNABLE 600 ML 12 MC', units: 12, unitPrice: 1.17, packPrice: 14.00 },
  { supplier: 'AJEPER S.A', code: '622377', name: 'CIFRUT CITRUS 350 ml PET 15 pack', units: 15, unitPrice: 0.80, packPrice: 12.00 },
  { supplier: 'AJEPER S.A', code: '622376', name: 'CIFRUT FRUIT 350 ml PET 15 pack', units: 15, unitPrice: 0.80, packPrice: 12.00 },
  { supplier: 'AJEPER S.A', code: '621788', name: 'CIFRUT ISLAND 350 ml PET 15 pack', units: 15, unitPrice: 0.80, packPrice: 12.00 },
  { supplier: 'AJEPER S.A', code: '624050', name: 'KR COLA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '699311', name: 'KR FRESA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '699404', name: 'KR GUARANA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '622386', name: 'KR ISLAND PUNCH PET NO RETONABLE 350 ML 15 CM', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '624046', name: 'KR KOLITA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '699303', name: 'KR LIMA LIMON PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '699289', name: 'KR NARANJA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '699302', name: 'KR PIÑA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '699411', name: 'ORO ORO PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.80, packPrice: 12.00 },
  { supplier: 'AJEPER S.A', code: '699360', name: 'PULP DURAZNO TETRA PAK 315 ML 24 MC', units: 24, unitPrice: 1.30, packPrice: 31.25 },
  { supplier: 'AJEPER S.A', code: '699378', name: 'SPORADE BLUEBERRY 500 ml PET 12 pack', units: 12, unitPrice: 1.59, packPrice: 20.00 },
  { supplier: 'AJEPER S.A', code: '699370', name: 'SPORADE MANDARINA 500 ml PET 12 pack', units: 12, unitPrice: 1.59, packPrice: 20.00 },
  { supplier: 'AJEPER S.A', code: '699371', name: 'SPORADE TROPICAL 500 ml PET 12 pack', units: 12, unitPrice: 1.59, packPrice: 20.00 },
  { supplier: 'AJEPER S.A', code: '622783', name: 'VOLT GAMER PONCHE FRUTAS 300 ML', units: 12, unitPrice: 1.59, packPrice: 20.00 },
  { supplier: 'AJEPER S.A', code: '699538', name: 'VOLT GINSENG 300 ml PET (FANTASY)', units: 12, unitPrice: 1.59, packPrice: 20.00 },
  { supplier: 'AJEPER S.A', code: '699546', name: 'VOLT MACA 300 ml PET (FRAMBRUESA)', units: 12, unitPrice: 1.59, packPrice: 20.00 },
  { supplier: 'AJEPER S.A', code: '699547', name: 'VOLT PINK 300 ml PET', units: 12, unitPrice: 1.59, packPrice: 20.00 },
];

export const PRODUCTS: Product[] = rawProducts.map((p) => ({
  id: `${p.supplier}-${p.code}`,
  supplier: p.supplier,
  supplierCode: p.code,
  name: p.name,
  unitsPerBox: p.units,
  unitPrice: p.unitPrice,
  packPrice: p.packPrice,
  category: categorize(p.name),
}));

export const CATEGORIES: ProductCategory[] = ['agua', 'gaseosa', 'energizante', 'jugo', 'deporte', 'otro'];
```

- [ ] **Step 3: Create data/suppliers.ts**

```typescript
import type { Supplier } from '../types';

export const SUPPLIERS: Supplier[] = [
  {
    id: 'ajeper',
    name: 'AJEPER S.A',
    displayName: 'AJEPER',
  },
];
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/types src/data
git commit -m "feat: add type definitions and product data layer"
```

---

## Task 3: Zustand Store with Persistence

**Files:**
- Create: `src/store/useOrderStore.ts`

**Interfaces:**
- Consumes: `Product`, `CartItem`, `CustomerInfo`, `Order` from types
- Produces: `useOrderStore` hook with `cart`, `customerName`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `setCustomerName`, `getOrder`, `resetOrder`

- [ ] **Step 1: Create store/useOrderStore.ts**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/store
git commit -m "feat: add Zustand store with cart persistence"
```

---

## Task 4: Utility Functions + Constants

**Files:**
- Create: `src/utils/formatters.ts`, `src/utils/constants.ts`

**Interfaces:**
- Consumes: None
- Produces: `formatCurrency`, `formatProductSummary`, `generateWhatsAppUrl`, `DEFAULT_CUSTOMER_NAME`, `CURRENCY_SYMBOL`

- [ ] **Step 1: Create utils/constants.ts**

```typescript
export const DEFAULT_CUSTOMER_NAME = 'Susana';
export const CURRENCY_SYMBOL = 'S/';
export const APP_NAME = 'Pedidos Susana';
export const WHATSAPP_BASE_URL = 'https://wa.me';
```

- [ ] **Step 2: Create utils/formatters.ts**

```typescript
import { CURRENCY_SYMBOL, WHATSAPP_BASE_URL } from './constants';
import type { CartItem } from '../types';

export const formatCurrency = (amount: number): string => {
  return `${CURRENCY_SYMBOL} ${amount.toFixed(2)}`;
};

export const formatProductSummary = (item: CartItem): string => {
  return `${item.quantity}x ${item.product.name} (${formatCurrency(item.product.packPrice * item.quantity)})`;
};

export const generateWhatsAppMessage = (
  customerName: string,
  items: CartItem[],
  total: number
): string => {
  const lines = [
    `Hola, me comunico de parte de ${customerName} para realizar el siguiente pedido:`,
    '',
    ...items.map((item) => `- ${formatProductSummary(item)}`),
    '',
    `Total del pedido: ${formatCurrency(total)}. Gracias.`,
  ];
  return lines.join('\n');
};

export const generateWhatsAppUrl = (message: string): string => {
  const encoded = encodeURIComponent(message);
  return `${WHATSAPP_BASE_URL}?text=${encoded}`;
};
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/utils
git commit -m "feat: add formatters and WhatsApp URL generator"
```

---

## Task 5: useWhatsApp Hook

**Files:**
- Create: `src/hooks/useWhatsApp.ts`

**Interfaces:**
- Consumes: `useOrderStore` (cart, customerName, getSubtotal), `generateWhatsAppMessage`, `generateWhatsAppUrl`
- Produces: `useWhatsApp` hook returning `{ sendOrder, message, url, canSend }`

- [ ] **Step 1: Create hooks/useWhatsApp.ts**

```typescript
import { useMemo } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { generateWhatsAppMessage, generateWhatsAppUrl } from '../utils/formatters';

export const useWhatsApp = () => {
  const cart = useOrderStore((s) => s.cart);
  const customerName = useOrderStore((s) => s.customerName);
  const getSubtotal = useOrderStore((s) => s.getSubtotal);

  const canSend = cart.length > 0;

  const message = useMemo(() => {
    if (!canSend) return '';
    return generateWhatsAppMessage(customerName, cart, getSubtotal());
  }, [cart, customerName, getSubtotal, canSend]);

  const url = useMemo(() => {
    if (!canSend) return '';
    return generateWhatsAppUrl(message);
  }, [message, canSend]);

  const sendOrder = () => {
    if (canSend && url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return { sendOrder, message, url, canSend };
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/hooks
git commit -m "feat: add useWhatsApp hook for message generation"
```

---

## Task 6: UI Components - Button + Header + ProductCard

**Files:**
- Create: `src/components/ui/Button.tsx`, `src/components/Header.tsx`, `src/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `useOrderStore` (cart, addItem), `Product` type
- Produces: Reusable Button, Header with cart badge, ProductCard with add-to-cart

- [ ] **Step 1: Create components/ui/Button.tsx**

```typescript
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-sky-500 text-white hover:bg-sky-600',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

- [ ] **Step 2: Create components/Header.tsx**

```typescript
import { ShoppingCart, Package } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';

interface HeaderProps {
  onCartClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartClick }) => {
  const cart = useOrderStore((s) => s.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-sky-500" />
          <h1 className="text-lg font-bold text-gray-900">Pedidos Susana</h1>
        </div>
        <button
          onClick={onCartClick}
          className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
```

- [ ] **Step 3: Create components/ProductCard.tsx**

```typescript
import { Plus } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { formatCurrency } from '../utils/formatters';
import { Button } from './ui/Button';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useOrderStore((s) => s.addItem);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {product.supplierCode}
        </p>
        <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-sky-600">
            {formatCurrency(product.packPrice)}
          </span>
          <span className="text-sm text-gray-500">
            / {product.unitsPerBox} uds
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {formatCurrency(product.unitPrice)} c/u
        </p>
      </div>
      <Button
        onClick={() => addItem(product)}
        className="w-full mt-3"
        size="sm"
      >
        <Plus className="w-4 h-4" />
        Agregar
      </Button>
    </div>
  );
};
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "feat: add Button, Header, and ProductCard components"
```

---

## Task 7: ProductList + Search/Filter

**Files:**
- Create: `src/components/ProductList.tsx`

**Interfaces:**
- Consumes: `PRODUCTS`, `CATEGORIES` from data, `ProductCard` component
- Produces: `ProductList` component with search input and category filter

- [ ] **Step 1: Create components/ProductList.tsx**

```typescript
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from './ProductCard';
import type { ProductCategory } from '../types';

export const ProductList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.supplierCode.includes(search);
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar producto o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-sky-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-sky-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No se encontraron productos</p>
          <p className="text-sm mt-1">Intenta con otro término de búsqueda</p>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ProductList.tsx
git commit -m "feat: add ProductList with search and category filter"
```

---

## Task 8: CartDrawer Component

**Files:**
- Create: `src/components/CartDrawer.tsx`

**Interfaces:**
- Consumes: `useOrderStore` (cart, removeItem, updateQuantity, clearCart, getSubtotal, getTotalBoxes), `formatCurrency`, `Button`
- Produces: `CartDrawer` component (slide-out panel with cart items + order form trigger)

- [ ] **Step 1: Create components/CartDrawer.tsx**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/CartDrawer.tsx
git commit -m "feat: add CartDrawer with quantity controls and totals"
```

---

## Task 9: OrderForm + WhatsAppButton

**Files:**
- Create: `src/components/OrderForm.tsx`, `src/components/WhatsAppButton.tsx`

**Interfaces:**
- Consumes: `useOrderStore` (customerName, setCustomerName, cart, getSubtotal, resetOrder), `useWhatsApp`, `formatCurrency`, `Button`
- Produces: `OrderForm` with customer name input + submit; `WhatsAppButton` that opens wa.me link

- [ ] **Step 1: Create components/WhatsAppButton.tsx**

```typescript
import { MessageCircle } from 'lucide-react';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { Button } from './ui/Button';

export const WhatsAppButton: React.FC = () => {
  const { sendOrder, canSend } = useWhatsApp();

  return (
    <Button
      onClick={sendOrder}
      disabled={!canSend}
      className="w-full bg-green-500 hover:bg-green-600 text-white"
      size="lg"
    >
      <MessageCircle className="w-5 h-5" />
      Enviar pedido por WhatsApp
    </Button>
  );
};
```

- [ ] **Step 2: Create components/OrderForm.tsx**

```typescript
import { useForm } from 'react-hook-form';
import { useOrderStore } from '../store/useOrderStore';
import { formatCurrency } from '../utils/formatters';
import { Button } from './ui/Button';
import { WhatsAppButton } from './WhatsAppButton';

interface FormData {
  customerName: string;
}

interface OrderFormProps {
  onBack: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ onBack }) => {
  const cart = useOrderStore((s) => s.cart);
  const customerName = useOrderStore((s) => s.customerName);
  const setCustomerName = useOrderStore((s) => s.setCustomerName);
  const getSubtotal = useOrderStore((s) => s.getSubtotal);
  const getTotalBoxes = useOrderStore((s) => s.getTotalBoxes);
  const resetOrder = useOrderStore((s) => s.resetOrder);

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: { customerName },
  });

  const subtotal = getSubtotal();
  const totalBoxes = getTotalBoxes();

  const onSubmit = (data: FormData) => {
    setCustomerName(data.customerName);
  };

  const handleNewOrder = () => {
    resetOrder();
    onBack();
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No hay productos en el pedido</p>
        <Button onClick={onBack} className="mt-4" variant="secondary">
          Volver al catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Resumen del pedido</h2>
        <p className="text-sm text-gray-500">
          {totalBoxes} cajas - {cart.length} productos diferentes
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-200">
        {cart.map((item) => (
          <div key={item.productId} className="flex items-center justify-between p-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.product.name}
              </p>
              <p className="text-xs text-gray-500">
                {item.quantity} cajas x {formatCurrency(item.product.packPrice)}
              </p>
            </div>
            <span className="text-sm font-semibold text-sky-600 ml-4">
              {formatCurrency(item.product.packPrice * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold">Total</span>
          <span className="text-xl font-bold text-sky-600">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del cliente
            </label>
            <input
              {...register('customerName', { required: true })}
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              placeholder="Ej: Susana"
            />
          </div>
        </form>
      </div>

      <WhatsAppButton />

      <div className="flex gap-3">
        <Button onClick={onBack} variant="secondary" className="flex-1">
          Volver
        </Button>
        <Button onClick={handleNewOrder} variant="ghost" className="flex-1">
          Nuevo pedido
        </Button>
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/OrderForm.tsx src/components/WhatsAppButton.tsx
git commit -m "feat: add OrderForm with customer input and WhatsAppButton"
```

---

## Task 10: App.tsx - Main Layout + Routing

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `Header`, `ProductList`, `CartDrawer`, `OrderForm`
- Produces: Complete app with hash-based routing between catalog and order view

- [ ] **Step 1: Replace src/App.tsx**

```typescript
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
      <Header onCartClick={() => setCartOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 py-6">
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Run dev server and test manually**

```bash
npm run dev
```

Test:
- Products display correctly
- Search filters products
- Add items to cart
- Cart badge shows count
- Cart drawer opens/closes
- Quantity +/- works
- Order form shows totals
- Customer name input works
- WhatsApp button generates correct message

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add main App layout with hash routing"
```

---

## Task 11: PWA Configuration

**Files:**
- Modify: `vite.config.ts`
- Create: `public/manifest.webmanifest`, PWA icons (placeholder SVG)

**Interfaces:**
- Consumes: None
- Produces: PWA manifest, service worker, install prompt support

- [ ] **Step 1: Install PWA plugin**

```bash
npm install vite-plugin-pwa
```

- [ ] **Step 2: Update vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Pedidos Susana',
        short_name: 'Pedidos',
        description: 'Aplicación para hacer pedidos a proveedores vía WhatsApp',
        theme_color: '#0ea5e9',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
```

- [ ] **Step 3: Create placeholder PWA icons**

Create simple SVG placeholder icons at `public/icons/icon-192.svg` and `public/icons/icon-512.svg`.

- [ ] **Step 4: Test PWA install prompt**

```bash
npm run dev
```

Open Chrome DevTools > Application tab > Manifest section. Verify manifest loads correctly.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts public/
git commit -m "feat: add PWA configuration with vite-plugin-pwa"
```

---

## Task 12: Final Polish + Build Test

**Files:**
- Modify: Various files for final adjustments

**Interfaces:**
- Consumes: All previous tasks
- Produces: Production-ready build

- [ ] **Step 1: Run build**

```bash
npm run build
```

Expected: No errors, output in `dist/` folder

- [ ] **Step 2: Test production build locally**

```bash
npm run preview
```

Test all features work in production mode

- [ ] **Step 3: Final TypeScript check**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: complete Pedidos Susana PWA with WhatsApp integration"
```

---

## Implementation Order Summary

| Task | Description | Dependencies |
|------|-------------|--------------|
| 1 | Project Scaffold | None |
| 2 | Types + Data | None |
| 3 | Zustand Store | Task 2 |
| 4 | Utilities | Task 2 |
| 5 | useWhatsApp Hook | Tasks 3, 4 |
| 6 | Button + Header + ProductCard | Tasks 3, 4 |
| 7 | ProductList + Search | Task 6 |
| 8 | CartDrawer | Tasks 3, 4, 6 |
| 9 | OrderForm + WhatsAppButton | Tasks 3, 5, 6 |
| 10 | App.tsx Main Layout | Tasks 6-9 |
| 11 | PWA Configuration | Task 1 |
| 12 | Final Polish + Build | All tasks |

**Total estimated time:** 2-3 hours for an experienced developer

## Updated Stack Summary

| Library | Version | Notes |
|---------|---------|-------|
| React | 19.2.x | Latest with React Compiler support |
| Vite | 8.0.x | Latest with Oxc-based transforms |
| @vitejs/plugin-react | 6.0.x | Uses Oxc, no Babel dependency |
| TypeScript | 6.0.x | Latest stable |
| Tailwind CSS | 4.3.x | New CSS-first config (no tailwind.config.js) |
| @tailwindcss/vite | 4.3.x | Official Vite plugin |
| Zustand | 5.0.12 | Latest with persist middleware |
| React Hook Form | 7.77.x | Latest with React 19 support |
| vite-plugin-pwa | Latest | PWA support |
| lucide-react | Latest | Icons |
| date-fns | Latest | Date formatting |

---

## Self-Review Checklist

- [x] **Spec coverage:** All requirements from brainstorming covered
- [x] **No placeholders:** All code blocks complete
- [x] **Type consistency:** Types defined in Task 2 used throughout
- [x] **File paths:** Exact paths specified
- [x] **Test steps:** Each task has verification step
- [x] **Commit steps:** Each task ends with commit
