import { useCartStore } from '@/store/cartStore';

const PriceSummary = () => {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getTotalDiscount = useCartStore((s) => s.getTotalDiscount);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = getSubtotal();
  const discount = getTotalDiscount();
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  return (
    <div className="rounded-sm bg-card p-4 shadow-sm">
      <h3 className="mb-4 border-b border-border pb-2 text-base font-semibold uppercase text-muted-foreground">
        Price Details
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Price ({totalItems} items)</span>
          <span>₹{(subtotal + discount).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-flipkart-green">
          <span>Discount</span>
          <span>− ₹{discount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span className={deliveryFee === 0 ? 'text-flipkart-green' : ''}>
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>
        <div className="flex justify-between border-t border-dashed border-border pt-3 text-base font-bold">
          <span>Total Amount</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>
      <div className="mt-4 rounded bg-flipkart-green/10 px-3 py-2 text-sm font-medium text-flipkart-green">
        You will save ₹{discount.toLocaleString()} on this order
      </div>
    </div>
  );
};

export default PriceSummary;
