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
