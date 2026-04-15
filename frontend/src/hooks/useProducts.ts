import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductById } from '@/services/api';

export const useProducts = (category?: string, search?: string) =>
  useQuery({
    queryKey: ['products', category, search],
    queryFn: () => fetchProducts(category, search),
  });

export const useProduct = (id?: string) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
    enabled: !!id,
  });
