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
    <article className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-sky-700 uppercase tracking-wide">
          Código: {product.supplierCode}
        </p>
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] leading-tight">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-sky-700">
            {formatCurrency(product.packPrice)}
          </span>
          <span className="text-base text-gray-600 font-medium">
            / {product.unitsPerBox} unidades
          </span>
        </div>
        <p className="text-base text-gray-600">
          {formatCurrency(product.unitPrice)} por unidad
        </p>
      </div>
      <Button
        onClick={() => addItem(product)}
        className="w-full mt-4"
        size="md"
        aria-label={`Agregar ${product.name} al carrito`}
      >
        <Plus className="w-5 h-5" aria-hidden="true" />
        Agregar al carrito
      </Button>
    </article>
  );
};
