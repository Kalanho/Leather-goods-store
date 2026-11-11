import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { fetchProducts } from '@/api/products';
import styles from './AdminProductsPage.module.css';

// Словарь для перевода подкатегорий
const CATEGORY_LABELS: Record<string, string> = {
  documents: 'Для документов',
  wallets: 'Кошельки',
  belts: 'Ремни',
  bags: 'Сумки',
  gift_sets: 'Подарочные наборы',
  accessories: 'Кожаные аксессуары',
  gift_boxes: 'Подарочные упаковки',
  none: 'Без категории'
};

export const AdminProductsPage = () => {
  const queryClient = useQueryClient();
  
  // Состояние для фильтра
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // 1. Получаем товары
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => fetchProducts({ limit: 100 }),
  });

  // 2. Мутация для скрытия (мягкого удаления)
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
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

  // Фильтруем товары перед отрисовкой
  const filteredProducts = data?.data.filter(product => 
    filterCategory === 'all' ? true : product.subCategory === filterCategory
  ) || [];

  return (
    <div>
      <div className={styles.header}>
        <h1>Товары</h1>
        <Link to="/admin/products/new" className={styles.addBtn}>
          + Добавить товар
        </Link>
      </div>

      {/* Блок с фильтром */}
      <div className={styles.filters}>
        <label>
          Показать категорию:
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className={styles.select}
          >
            <option value="all">Все товары</option>
            <option value="belts">Ремни</option>
            <option value="bags">Сумки</option>
            <option value="wallets">Кошельки</option>
            <option value="documents">Для документов</option>
            <option value="gift_sets">Подарочные наборы</option>
            <option value="accessories">Аксессуары</option>
            <option value="gift_boxes">Упаковки</option>
          </select>
        </label>
        <span className={styles.count}>Найдено: {filteredProducts.length}</span>
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
            {filteredProducts.map((product) => (
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
                <td>
                  {CATEGORY_LABELS[product.subCategory] || product.subCategory}
                </td>
                <td>{product.basePrice} BYN</td>
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
        
        {filteredProducts.length === 0 && (
          <div className={styles.empty}>В этой категории пока нет товаров.</div>
        )}
      </div>
    </div>
  );
};