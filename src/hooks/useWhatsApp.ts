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
