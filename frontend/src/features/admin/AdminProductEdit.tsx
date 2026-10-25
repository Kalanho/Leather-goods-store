import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProductByIdAdmin, updateProductAdmin } from '@/api/admin';
import { ProductForm } from './ProductForm';
import type { Product } from '@/types';

export const AdminProductEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => fetchProductByIdAdmin(id!),
    enabled: !!id,
  });

  const onSubmit = async (data: Partial<Product>) => {
    await updateProductAdmin(id!, data);
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
    navigate('/admin/products');
  };

  if (isLoading) return <div>Загрузка…</div>;
  if (!product) return <div>Товар не найден</div>;

  return (
    <div>
      <h1 style={{ marginBottom: 32, fontFamily: 'var(--font-serif)' }}>Редактирование: {product.name}</h1>
      <ProductForm initialData={product} onSubmit={onSubmit} isEdit />
    </div>
  );
};