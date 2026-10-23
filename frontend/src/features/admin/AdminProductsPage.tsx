import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { fetchProducts } from '@/api/products';
import styles from './AdminProductsPage.module.css';

export const AdminProductsPage = () => {
  const queryClient = useQueryClient();

  // 1. Получаем товары (пока используем публичный роут, чуть позже заменим на админский)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => fetchProducts({ limit: 100 }), // берем все
  });

  // 2. Мутация для скрытия (мягкого удаления)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      // Обновляем список после удаления
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      alert('Ошибка удаления: ' + (error as Error).message);
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Скрыть товар "${name}" из каталога?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Загрузка товаров…</div>;

  return (
    <div>
      <div className={styles.header}>
        <h1>Товары</h1>
        <Link to="/admin/products/new" className={styles.addBtn}>
          + Добавить товар
        </Link>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Фото</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.images[0] ? (
                    <img src={product.images[0]} alt="" className={styles.thumb} />
                  ) : (
                    <div className={styles.thumbEmpty}>Нет</div>
                  )}
                </td>
                <td>
                  <strong>{product.name}</strong>
                  <br />
                  <small className={styles.slug}>{product.slug}</small>
                </td>
                <td>{product.subCategory}</td>
                <td>{product.basePrice} ₽</td>
                <td>
                  {product.isActive ? (
                    <span className={styles.statusActive}>Активен</span>
                  ) : (
                    <span className={styles.statusHidden}>Скрыт</span>
                  )}
                </td>
                <td>
                  <div className={styles.actions}>
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className={styles.editBtn}
                    >
                      Ред.
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className={styles.deleteBtn}
                      disabled={!product.isActive}
                    >
                      Скрыть
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {data?.data.length === 0 && (
          <div className={styles.empty}>Товаров пока нет. Добавьте первый!</div>
        )}
      </div>
    </div>
  );
};