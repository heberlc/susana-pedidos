import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
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

  const categoryLabels: Record<ProductCategory | 'all', string> = {
    all: 'Todos',
    agua: 'Agua',
    gaseosa: 'Gaseosa',
    energizante: 'Energizante',
    jugo: 'Jugo',
    deporte: 'Deporte',
    otro: 'Otro',
  };

  return (
    <div className="space-y-5">
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">Buscar producto</label>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" aria-hidden="true" />
        <input
          id="search-input"
          type="search"
          placeholder="Buscar producto o código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-300 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-600 placeholder:text-gray-400"
          aria-describedby="search-hint"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl min-h-11 min-w-11 flex items-center justify-center"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
        <p id="search-hint" className="sr-only">Escribe el nombre del producto o su código para buscar</p>
      </div>

      <nav aria-label="Filtrar por categoría">
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide" role="tablist">
          <button
            onClick={() => setSelectedCategory('all')}
            role="tab"
            aria-selected={selectedCategory === 'all'}
            className={`px-5 py-3 rounded-2xl text-base font-semibold whitespace-nowrap transition-all min-h-12 ${
              selectedCategory === 'all'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
            }`}
          >
            Todos
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`px-5 py-3 rounded-2xl text-base font-semibold whitespace-nowrap transition-all min-h-12 ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </nav>

      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        role="tabpanel"
        aria-label="Lista de productos"
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16 text-gray-600" role="status">
          <p className="text-2xl font-bold mb-2">No se encontraron productos</p>
          <p className="text-lg">Intenta con otro término de búsqueda</p>
        </div>
      )}
      
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {filteredProducts.length > 0 && (
          <span>{filteredProducts.length} productos encontrados</span>
        )}
      </div>
    </div>
  );
};
