import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/services/api';

const ProductCard = ({ product }: { product: Product }) => {
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-sm bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleItem(product.id);
        }}
        className="absolute right-2 top-2 z-10 rounded-full bg-card p-1.5 shadow-sm"
      >
        <Heart
          size={16}
          className={wishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}
        />
      </button>

      <div className="mb-3 flex items-center justify-center overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-40 w-auto object-contain transition-transform group-hover:scale-105 md:h-48"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">{product.title}</h3>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-0.5 rounded-sm bg-flipkart-green px-1.5 py-0.5 text-xs font-medium text-success-foreground">
            {product.rating} <Star size={10} fill="currentColor" />
          </span>
          <span className="text-xs text-muted-foreground">
            ({product.ratingCount.toLocaleString()})
          </span>
        </div>

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-base font-bold text-foreground">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            ₹{product.originalPrice.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-flipkart-green">{product.discount}% off</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
