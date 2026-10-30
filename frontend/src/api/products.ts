import { api } from './client';
import type { Product, ProductsResponse } from '@/types';

export interface ProductsFilter {
  category?: string;
  subCategory?: string;
  color?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  isPreOrder?: boolean;
  isTopSelling?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const fetchProducts = async (
  filter: ProductsFilter = {}
): Promise<ProductsResponse> => {
  const { data } = await api.get<ProductsResponse>('/products', {
    params: filter,
  });
  return data;
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const { data } = await api.get<{ success: boolean; data: Product }>(
    `/products/${slug}`
  );
  return data.data;
};
export const fetchTopProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<ProductsResponse>('/products', {
    params: { isTopSelling: true, limit: 4 },
  });
  return data.data;
};