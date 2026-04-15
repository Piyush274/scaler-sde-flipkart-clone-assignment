import { Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { fetchProductById, type Product } from '@/services/api';
import { useQueries } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const Wishlist = () => {
  const { items, toggleItem } = useWishlistStore();
  const addToCart = useCartStore((s) => s.addItem);

  const queries = useQueries({
    queries: items.map((id) => ({
      queryKey: ['product', id],
      queryFn: () => fetchProductById(id),
      staleTime: Infinity,
    })),
  });

  const products = queries
    .map((q) => q.data)
    .filter((p): p is Product => !!p);

  const isLoading = queries.some((q) => q.isLoading);

  const handleMoveToCart = async (product: Product) => {
    try {
      await addToCart({
        productId: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
      });
      toggleItem(product.id);
      toast({ title: 'Moved to cart', description: product.title });
    } catch {
      toast({ title: 'Could not move item to cart', variant: 'destructive' });
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Heart size={64} className="mb-4 text-muted-foreground/40" />
        <h2 className="text-lg font-medium text-foreground">Your wishlist is empty</h2>
        <p className="mt-1 text-sm text-muted-foreground">Add items you love to your wishlist</p>
        <Link
          to="/"
          className="mt-6 rounded-sm bg-primary px-8 py-2.5 text-sm font-bold text-primary-foreground"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-lg font-bold text-foreground">
        My Wishlist ({items.length})
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((id) => (
            <div key={id} className="h-72 animate-pulse rounded-sm bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-sm bg-card p-3 shadow-sm"
            >
              <Link to={`/product/${product.id}`} className="mb-3 flex items-center justify-center">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-40 w-auto object-contain transition-transform group-hover:scale-105 md:h-48"
                  loading="lazy"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-1">
                <h3 className="line-clamp-2 text-sm font-medium text-foreground">{product.title}</h3>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-0.5 rounded-sm bg-flipkart-green px-1.5 py-0.5 text-xs font-medium text-success-foreground">
                    {product.rating} <Star size={10} fill="currentColor" />
                  </span>
                </div>
                <div className="mt-auto flex items-baseline gap-2 pt-1">
                  <span className="text-base font-bold text-foreground">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-sm bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                >
                  <ShoppingCart size={14} /> Move to Cart
                </button>
                <button
                  onClick={() => toggleItem(product.id)}
                  className="rounded-sm border border-input p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
