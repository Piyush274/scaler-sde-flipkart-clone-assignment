import { api } from "@/services/http";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  ratingCount: number;
  category: string;
  images: string[];
  inStock: boolean;
  brand: string;
  specs: Record<string, string>;
}

interface BackendProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface BackendCartItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    price: number;
    category: string;
    stock: number;
    images?: string[];
  };
  quantity: number;
}

export interface BackendCartResponse {
  cartId: string;
  items: BackendCartItem[];
  subtotal: number;
  totalPrice: number;
}

interface BackendOrderItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    category: string;
    images?: string[];
  };
  quantity: number;
  price: number;
}

export interface BackendOrder {
  _id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: BackendOrderItem[];
}

interface BackendOrdersResponse {
  orders: BackendOrder[];
}

const toProduct = (product: BackendProduct): Product => {
  const originalPrice = Math.round(product.price * 1.15);
  const discount = Math.max(
    0,
    Math.round(((originalPrice - product.price) / originalPrice) * 100)
  );

  return {
    id: product._id,
    title: product.title,
    description: product.description,
    price: product.price,
    originalPrice,
    discount,
    rating: 4.2,
    ratingCount: 1200,
    category: product.category,
    images: product.images?.length ? product.images : [FALLBACK_IMAGE],
    inStock: product.stock > 0,
    brand: product.title.split(" ")[0] || "Brand",
    specs: {
      Category: product.category,
      Stock: String(product.stock),
    },
  };
};

export const fetchProducts = async (
  category?: string,
  search?: string
): Promise<Product[]> => {
  const params: Record<string, string> = {};

  if (category && category !== "all") params.category = category;
  if (search?.trim()) params.search = search.trim();

  const { data } = await api.get<BackendProduct[]>("/products", { params });
  return data.map(toProduct);
};

export const fetchProductById = async (
  id: string
): Promise<Product | undefined> => {
  try {
    const { data } = await api.get<BackendProduct>(`/products/${id}`);
    return toProduct(data);
  } catch {
    return undefined;
  }
};

export const testLogin = async () => {
  const { data } = await api.get<AuthResponse>("/auth/test-login");
  return data.user;
};

export const fetchCart = async () => {
  const { data } = await api.get<BackendCartResponse>("/cart");
  return data;
};

export const addToCartApi = async (productId: string, quantity = 1) => {
  const { data } = await api.post<BackendCartResponse>("/cart", {
    productId,
    quantity,
  });
  return data;
};

export const updateCartItemApi = async (itemId: string, quantity: number) => {
  const { data } = await api.put<BackendCartResponse>(`/cart/${itemId}`, {
    quantity,
  });
  return data;
};

export const deleteCartItemApi = async (itemId: string) => {
  const { data } = await api.delete<BackendCartResponse>(`/cart/${itemId}`);
  return data;
};

export const placeOrderApi = async () => {
  const { data } = await api.post<{ orderId: string }>("/orders");
  return data;
};

export const fetchOrderByIdApi = async (orderId: string) => {
  const { data } = await api.get<BackendOrder>(`/orders/${orderId}`);
  return data;
};

export const fetchOrdersApi = async () => {
  const { data } = await api.get<BackendOrdersResponse>("/orders");
  return data;
};
