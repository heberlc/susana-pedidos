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
      <div className="text-center py-16 text-gray-600">
        <p className="text-2xl font-bold mb-4">No hay productos en el pedido</p>
        <Button onClick={onBack} className="mt-4" variant="secondary" size="lg">
          Volver al catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Resumen del pedido</h2>
        <p className="text-lg text-gray-600">
          {totalBoxes} cajas - {cart.length} productos diferentes
        </p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm divide-y-2 divide-gray-200">
        {cart.map((item) => (
          <div key={item.productId} className="flex items-center justify-between p-5">
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-gray-900 truncate">
                {item.product.name}
              </p>
              <p className="text-base text-gray-600">
                {item.quantity} cajas x {formatCurrency(item.product.packPrice)}
              </p>
            </div>
            <span className="text-lg font-bold text-sky-700 ml-4">
              {formatCurrency(item.product.packPrice * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <span className="text-2xl font-bold text-gray-900">Total</span>
          <span className="text-3xl font-bold text-sky-700">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="customer-name" className="block text-lg font-semibold text-gray-800 mb-2">
              Tu nombre
            </label>
            <input
              id="customer-name"
              {...register('customerName', { required: true })}
              className="w-full px-4 py-4 bg-white border-2 border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-sky-300 focus:border-sky-600 placeholder:text-gray-400"
              placeholder="Ej: Susana"
              autoComplete="name"
            />
          </div>
        </form>
      </div>

      <WhatsAppButton />

      <div className="flex gap-4">
        <Button onClick={onBack} variant="secondary" className="flex-1" size="lg">
          Volver
        </Button>
        <Button onClick={handleNewOrder} variant="ghost" className="flex-1" size="lg">
          Nuevo pedido
        </Button>
      </div>
    </div>
  );
};
