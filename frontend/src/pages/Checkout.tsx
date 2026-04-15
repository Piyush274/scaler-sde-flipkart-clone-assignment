import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import PriceSummary from '@/components/PriceSummary';
import { toast } from '@/hooks/use-toast';
import { fetchOrderByIdApi, placeOrderApi } from '@/services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, getSubtotal } = useCartStore();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '',
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.pincode || !address.address || !address.city || !address.state) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    setStep(2);
  };

  const addOrder = useOrderStore((s) => s.addOrder);

  const handlePlaceOrder = async () => {
    try {
      const placed = await placeOrderApi();
      const order = await fetchOrderByIdApi(placed.orderId);

      addOrder({
        id: order._id,
        date: order.createdAt,
        items: order.items.map((i) => ({
          id: i._id,
          title: i.product.title,
          price: i.price,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          quantity: i.quantity,
        })),
        total: order.totalPrice,
        address: `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`,
        status: order.status,
      });

      clearCart();
      navigate('/order-success', { state: { orderId: placed.orderId } });
    } catch {
      toast({ title: 'Failed to place order', variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto grid gap-4 px-4 py-4 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        {/* Steps */}
        <div className="flex items-center justify-center gap-0 rounded-sm bg-card p-4 shadow-sm">
          {['Address', 'Order Summary', 'Payment'].map((label, i) => (
            <div key={label} className="flex items-center">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    step > i + 1
                      ? 'bg-flipkart-green text-success-foreground'
                      : step === i + 1
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > i + 1 ? <Check size={14} /> : i + 1}
                </span>
                <span className={`text-xs font-medium ${step >= i + 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </span>
              </div>
              {i < 2 && <div className="mx-3 h-px w-12 bg-border" />}
            </div>
          ))}
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <form onSubmit={handleAddressSubmit} className="rounded-sm bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold uppercase text-primary">Delivery Address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { key: 'name', label: 'Full Name', type: 'text' },
                { key: 'phone', label: 'Phone Number', type: 'tel' },
                { key: 'pincode', label: 'Pincode', type: 'text' },
                { key: 'locality', label: 'Locality', type: 'text' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">{field.label} *</label>
                  <input
                    type={field.type}
                    value={(address as any)[field.key]}
                    onChange={(e) => setAddress({ ...address, [field.key]: e.target.value })}
                    className="w-full rounded border border-input px-3 py-2 text-sm outline-none focus:border-primary"
                    required
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Address *</label>
                <textarea
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  className="w-full rounded border border-input px-3 py-2 text-sm outline-none focus:border-primary"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">City *</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full rounded border border-input px-3 py-2 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">State *</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full rounded border border-input px-3 py-2 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 rounded-sm bg-flipkart-orange px-10 py-3 text-sm font-bold uppercase text-card shadow hover:brightness-95"
            >
              Deliver Here
            </button>
          </form>
        )}

        {/* Step 2: Order Summary */}
        {step === 2 && (
          <div className="rounded-sm bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold uppercase text-primary">Order Summary</h2>
              <button onClick={() => setStep(1)} className="text-xs text-primary hover:underline">
                Change Address
              </button>
            </div>
            <div className="mb-3 rounded bg-muted p-3 text-sm">
              <p className="font-medium">{address.name}</p>
              <p className="text-muted-foreground">
                {address.address}, {address.locality}, {address.city}, {address.state} - {address.pincode}
              </p>
              <p className="text-muted-foreground">{address.phone}</p>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b border-border pb-3 last:border-0">
                  <img src={item.image} alt={item.title} className="h-16 w-16 rounded object-contain" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handlePlaceOrder}
              className="mt-6 w-full rounded-sm bg-flipkart-orange py-3.5 text-sm font-bold uppercase text-card shadow hover:brightness-95"
            >
              Continue
            </button>
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-20 lg:self-start">
        <PriceSummary />
      </div>
    </div>
  );
};

export default Checkout;
