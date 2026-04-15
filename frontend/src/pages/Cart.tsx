import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import PriceSummary from '@/components/PriceSummary';
import { toast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, updateQuantity, removeItem } = useCartStore();
  const navigate = useNavigate();
  const handleQuantityChange = async (id: string, quantity: number) => {
    try {
      await updateQuantity(id, quantity);
    } catch {
      toast({ title: 'Could not update cart item', variant: 'destructive' });
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeItem(id);
    } catch {
      toast({ title: 'Could not remove cart item', variant: 'destructive' });
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag size={80} className="text-muted" />
        <h2 className="mt-4 text-lg font-medium text-foreground">Your cart is empty!</h2>
        <p className="mt-1 text-sm text-muted-foreground">Add items to it now.</p>
        <Link
          to="/"
          className="mt-6 rounded-sm bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid gap-4 px-4 py-4 lg:grid-cols-[1fr_380px]">
      {/* Cart items */}
      <div className="space-y-3">
        <div className="rounded-sm bg-card p-4 shadow-sm">
          <h2 className="text-lg font-bold text-foreground">
            My Cart ({items.reduce((s, i) => s + i.quantity, 0)})
          </h2>
        </div>

        {items.map((item) => (
          <div key={item.id} className="rounded-sm bg-card p-4 shadow-sm">
            <div className="flex gap-4">
              <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-24 w-24 rounded object-contain"
                />
              </Link>
              <div className="flex-1">
                <Link to={`/product/${item.productId}`} className="text-sm font-medium text-foreground hover:text-primary">
                  {item.title}
                </Link>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-bold text-foreground">
                    ₹{item.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{item.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-medium text-flipkart-green">
                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center rounded border border-border">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="min-w-[32px] text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-muted-foreground hover:bg-muted"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-sm font-medium uppercase text-foreground hover:text-destructive"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end rounded-sm bg-card p-4 shadow-sm">
          <button
            onClick={() => navigate('/checkout')}
            className="rounded-sm bg-flipkart-orange px-12 py-3 text-sm font-bold uppercase text-card shadow hover:brightness-95"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* Price summary */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <PriceSummary />
      </div>
    </div>
  );
};

export default Cart;
