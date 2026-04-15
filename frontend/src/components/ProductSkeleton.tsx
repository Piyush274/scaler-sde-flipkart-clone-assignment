const ProductSkeleton = () => (
  <div className="animate-pulse rounded-sm bg-card p-3 shadow-sm">
    <div className="mb-3 h-40 rounded bg-muted md:h-48" />
    <div className="space-y-2">
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-3 w-1/2 rounded bg-muted" />
      <div className="h-4 w-2/3 rounded bg-muted" />
    </div>
  </div>
);

export default ProductSkeleton;
