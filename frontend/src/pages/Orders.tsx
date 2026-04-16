import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchOrdersApi } from '@/services/api';
import { type Order } from '@/store/orderStore';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrdersApi();
        setOrders(data.orders.map((order) => ({
          id: order._id,
          date: order.createdAt,
          total: order.totalPrice,
          status: order.status,
          address: order.address || '',
          items: order.items.map((item) => ({
            id: item._id,
            title: item.product.title,
            price: item.price,
            quantity: item.quantity,
            image:
              item.product.images?.length
                ? item.product.images[0]
                : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          })),
        })));
      } catch {
        setError('Unable to load order history.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package size={64} className="mb-4 text-muted-foreground/40" />
        <h2 className="text-lg font-medium text-foreground">Loading order history...</h2>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package size={64} className="mb-4 text-muted-foreground/40" />
        <h2 className="text-lg font-medium text-foreground">No order history yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Place your first order and it will appear here.
        </p>
        <Link
          to="/"
          className="mt-6 rounded-sm bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-lg font-bold text-foreground">Order History</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-sm bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <p className="text-xs text-muted-foreground">Order ID</p>
                <p className="text-sm font-bold text-foreground">{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm text-foreground">
                  {new Date(order.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-sm font-bold text-foreground">
                  ₹{order.total.toLocaleString()}
                </p>
              </div>
              <span className="rounded-full bg-flipkart-green/10 px-3 py-1 text-xs font-medium text-flipkart-green">
                {order.status}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-12 w-12 rounded-sm object-contain"
                  />
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
