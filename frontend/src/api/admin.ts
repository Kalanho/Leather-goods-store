import { api } from './client';
import type { Product } from '@/types';

// Загрузка картинок (multipart/form-data)
export const uploadProductImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const { data } = await api.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data; // массив URL
};

// Создание товара
export const createProductAdmin = async (payload: Partial<Product>) => {
  const { data } = await api.post('/products', payload);
  return data.data;
};

// Обновление товара
export const updateProductAdmin = async (id: string, payload: Partial<Product>) => {
  const { data } = await api.patch(`/products/${id}`, payload);
  return data.data;
};

// Получение одного товара по ID (для редактирования)
// Внимание: у нас сейчас публичный API ищет по slug, поэтому для админки 
// лучше добавить роут GET /api/products/id/:id на бэкенде. 
// Пока просто найдем его через публичный список.
export const fetchProductByIdAdmin = async (id: string): Promise<Product> => {
  const { data } = await api.get('/products', { params: { limit: 100 } });
  const product = data.data.find((p: Product) => p._id === id);
  if (!product) throw new Error('Товар не найден');
  return product;
};