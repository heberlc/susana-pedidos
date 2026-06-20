import { MessageCircle } from 'lucide-react';
import { useWhatsApp } from '../hooks/useWhatsApp';
import { Button } from './ui/Button';

export const WhatsAppButton: React.FC = () => {
  const { sendOrder, canSend } = useWhatsApp();

  return (
    <Button
      onClick={sendOrder}
      disabled={!canSend}
      className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
      size="lg"
      aria-label={canSend ? "Enviar pedido por WhatsApp" : "Agrega productos al carrito para enviar por WhatsApp"}
    >
      <MessageCircle className="w-6 h-6" aria-hidden="true" />
      Enviar pedido por WhatsApp
    </Button>
  );
};
