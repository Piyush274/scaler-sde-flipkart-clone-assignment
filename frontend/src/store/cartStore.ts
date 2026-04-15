import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  addToCartApi,
  deleteCartItemApi,
  fetchCart,
  updateCartItemApi,
  type BackendCartResponse,
} from '@/services/api';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  hydrateFromBackend: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotalDiscount: () => number;
}

const mapCartResponse = (payload: BackendCartResponse): CartItem[] =>
  payload.items.map((item) => ({
    id: item._id,
    productId: item.product._id,
    title: item.product.title,
    price: item.product.price,
    originalPrice: Math.round(item.product.price * 1.15),
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    quantity: item.quantity,
  }));

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrateFromBackend: async () => {
        const payload = await fetchCart();
        set({ items: mapCartResponse(payload) });
      },
      addItem: async (item) => {
        const payload = await addToCartApi(item.productId, 1);
        set({ items: mapCartResponse(payload) });
      },
      removeItem: async (id) => {
        const payload = await deleteCartItemApi(id);
        set({ items: mapCartResponse(payload) });
      },
      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          const payload = await deleteCartItemApi(id);
          set({ items: mapCartResponse(payload) });
          return;
        }

        const payload = await updateCartItemApi(id, quantity);
        set({ items: mapCartResponse(payload) });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getTotalDiscount: () =>
        get().items.reduce(
          (sum, i) => sum + (i.originalPrice - i.price) * i.quantity,
          0
        ),
    }),
    { name: 'flipkart-cart' }
  )
);
