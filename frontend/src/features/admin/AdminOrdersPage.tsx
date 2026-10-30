import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { fetchAdminOrders, updateOrderStatusApi, deleteOrderApi } from '@/api/adminOrders';
import { OrderModal } from './components/OrderModal';
import styles from './AdminOrdersPage.module.css';

export const AdminOrdersPage = () => {
  const [isArchive, setIsArchive] = useState(false);
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', isArchive],
    queryFn: () => fetchAdminOrders(isArchive),
  });

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const archiveMutation = useMutation({
    mutationFn: ({ id, isArchived }: { id: string; isArchived: boolean }) => 
      updateOrderStatusApi(id, { isArchived }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteOrderApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  const handleArchiveToggle = (id: string, currentArchiveStatus: boolean) => {
    archiveMutation.mutate({ id, isArchived: !currentArchiveStatus });
  };

  const handleDelete = (id: string, orderNumber: string) => {
    if (window.confirm(`Вы уверены, что хотите НАВСЕГДА удалить заказ ${orderNumber}?`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <Link to="/admin/products" className={styles.backLink}>
          ← Вернуться к товарам
        </Link>
        <h1>Управление заказами</h1>
        <p className={styles.subtitle}>Здесь отображаются все текущие и архивные заказы клиентов</p>
      </div>

      <div className={styles.tabs}>
        <button 
          className={!isArchive ? styles.activeTab : styles.tab} 
          onClick={() => setIsArchive(false)}
        >
          Активные заказы
        </button>
        <button 
          className={isArchive ? styles.activeTab : styles.tab} 
          onClick={() => setIsArchive(true)}
        >
          Архив
        </button>
      </div>

      <div className={styles.tableWrap}>
        {isLoading ? (
           <div className={styles.empty}>Загрузка...</div>
        ) : orders?.length === 0 ? (
           <div className={styles.empty}>
             {isArchive ? 'В архиве пока пусто' : 'Новых заказов нет'}
           </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Номер</th>
                <th>Дата</th>
                <th>Клиент</th>
                <th>Сумма</th>
                <th>Оплата</th>
                <th>Трек-номер</th>
                <th style={{ textAlign: 'right' }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order._id}>
                  <td><strong>{order.orderNumber}</strong></td>
                  <td>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td>
                    <div className={styles.clientName}>{order.customer.fullName}</div>
                    <div className={styles.phone}>{order.customer.phone}</div>
                  </td>
                  <td><strong>{order.total} ₽</strong></td>
                  <td>
                    <span className={order.payment.status === 'paid' ? styles.statusPaid : styles.statusPending}>
                      {order.payment.status === 'paid' ? 'Оплачен' : 'Ожидает'}
                    </span>
                  </td>
                  <td>{order.delivery.trackNumber || <span className={styles.muted}>—</span>}</td>
                  <td>
                    <div className={styles.actionsCell}>
                      <button
                        className={styles.detailsBtn}
                        onClick={() => setSelectedOrder(order)}
                      >
                        Открыть
                      </button>
                      
                      <button
                        className={styles.archiveBtn}
                        onClick={() => handleArchiveToggle(order._id, !!order.isArchived)}
                      >
                        {isArchive ? 'Вернуть' : 'В архив'}
                      </button>

                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(order._id, order.orderNumber)}
                        title="Удалить навсегда"
                      >
                        ×
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};