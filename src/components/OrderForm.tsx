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
