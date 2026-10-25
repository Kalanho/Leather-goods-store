import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { createProductAdmin } from '@/api/admin';
import { ProductForm } from './ProductForm';
import type { Product } from '@/types';

export const AdminProductCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSubmit = async (data: Partial<Product>) => {
    await createProductAdmin(data);
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
    navigate('/admin/products');
  };

  return (
    <div>
      <h1 style={{ marginBottom: 32, fontFamily: 'var(--font-serif)' }}>Новый товар</h1>
      <ProductForm onSubmit={onSubmit} />
    </div>
  );
};