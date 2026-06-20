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
