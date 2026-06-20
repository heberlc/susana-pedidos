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
