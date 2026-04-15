import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Zap, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import ImageCarousel from '@/components/ImageCarousel';
import { toast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();

  if (isLoading) {
    return (
      <div className="container mx-auto animate-pulse px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 rounded bg-muted" />
          <div className="space-y-4">
            <div className="h-6 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-8 w-1/3 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center text-muted-foreground">Product not found</div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async () => {
    await addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
    });
    toast({ title: 'Added to cart!', description: product.title });
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <p className="mb-4 text-xs text-muted-foreground">
        Home / {product.category.charAt(0).toUpperCase() + product.category.slice(1)} / {product.title}
      </p>

      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        {/* Left: Images */}
        <div className="sticky top-20">
          <div className="relative">
            <button
              onClick={() => toggleItem(product.id)}
              className="absolute right-2 top-2 z-10 rounded-full bg-card p-2 shadow"
            >
              <Heart
                size={20}
                className={wishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}
              />
            </button>
            <ImageCarousel images={product.images} title={product.title} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 rounded-sm bg-accent py-3.5 text-sm font-bold uppercase text-accent-foreground shadow transition-colors hover:brightness-95"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-2 rounded-sm bg-flipkart-orange py-3.5 text-sm font-bold uppercase text-card shadow transition-colors hover:brightness-95"
            >
              <Zap size={18} /> Buy Now
            </button>
          </div>
        </div>

        {/* Right: Details */}
        <div className="rounded-sm bg-card p-5 shadow-sm">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h1 className="mt-1 text-lg font-medium text-foreground">{product.title}</h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5 rounded-sm bg-flipkart-green px-2 py-0.5 text-xs font-bold text-success-foreground">
              {product.rating} <Star size={11} fill="currentColor" />
            </span>
            <span className="text-sm text-muted-foreground">
              {product.ratingCount.toLocaleString()} Ratings
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-foreground">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-flipkart-green">{product.discount}% off</span>
          </div>

          {/* Stock */}
          <p className={`mt-2 text-sm font-medium ${product.inStock ? 'text-flipkart-green' : 'text-destructive'}`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </p>

          {/* Highlights */}
          <div className="mt-6 flex gap-6 text-xs text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <Truck size={20} className="text-foreground" />
              <span>Free Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw size={20} className="text-foreground" />
              <span>7 Day Return</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield size={20} className="text-foreground" />
              <span>Warranty</span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-sm font-bold text-foreground">Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          </div>

          {/* Specs */}
          <div className="mt-6">
            <h2 className="text-sm font-bold text-foreground">Specifications</h2>
            <div className="mt-2 space-y-2">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex text-sm">
                  <span className="w-32 flex-shrink-0 text-muted-foreground">{key}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
