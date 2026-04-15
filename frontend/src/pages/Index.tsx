import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '@/hooks/useProducts';
import CategoryBar from '@/components/CategoryBar';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';

const Index = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [category, setCategory] = useState('all');
  const { data: products, isLoading, error } = useProducts(category, searchQuery);

  return (
    <>
      <CategoryBar selected={category} onSelect={setCategory} />
      <div className="container mx-auto px-4 py-4">
        {searchQuery && (
          <p className="mb-4 text-sm text-muted-foreground">
            Showing results for "<span className="font-medium text-foreground">{searchQuery}</span>"
          </p>
        )}

        {error && (
          <div className="rounded bg-destructive/10 p-4 text-center text-destructive">
            Something went wrong. Please try again.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)
            : products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {!isLoading && products?.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
