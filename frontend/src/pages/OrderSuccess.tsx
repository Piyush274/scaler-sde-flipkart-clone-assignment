import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const orderId = (location.state as any)?.orderId || 'OD' + Date.now().toString(36).toUpperCase();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-sm bg-card p-8 text-center shadow-sm">
        <CheckCircle size={64} className="mx-auto text-flipkart-green" />
        <h1 className="mt-4 text-xl font-bold text-foreground">Order Placed Successfully!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you for your purchase. Your order has been placed and will be delivered soon.
        </p>

        <div className="mt-6 rounded bg-muted px-4 py-3 text-left">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Package size={18} className="text-primary" />
            <span>
              Your order was placed successfully. Use the order ID below to track it in your order history.
            </span>
          </div>
          <div className="mt-3 rounded-sm bg-background p-3 text-sm">
            <span className="block text-muted-foreground">Order ID</span>
            <span className="font-bold text-primary">{orderId}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            to="/orders"
            className="inline-block rounded-sm bg-flipkart-green px-4 py-3 text-sm font-bold uppercase text-card hover:brightness-95"
          >
            View Order History
          </Link>
          <Link
            to="/"
            className="inline-block rounded-sm bg-primary px-4 py-3 text-sm font-bold uppercase text-primary-foreground hover:brightness-95"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
