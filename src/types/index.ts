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
