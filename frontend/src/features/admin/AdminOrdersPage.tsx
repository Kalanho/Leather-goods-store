import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminOrders } from '@/api/adminOrders';
import { OrderModal } from './components/OrderModal';
import styles from './AdminOrdersPage.module.css';
import { Link } from 'react-router-dom';
import type { AdminOrder } from '@/api/adminOrders'; // adjust import to your type

export const AdminOrdersPage = () => {
  const { data: orders, isLoading } = useQuery<AdminOrder[]>({
    queryKey: ['admin-orders'],
    queryFn: fetchAdminOrders,
  });

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  if (isLoading) return <div style={{ padding: 40 }}>Загрузка заказов…</div>;

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Link to="/admin/products" className={styles.backLink}>
            ← Вернуться 
          </Link>
          <h1>Заказы</h1>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Номер</th>
              <th>Дата</th>
              <th>Клиент</th>
              <th>Сумма</th>
              <th>Оплата</th>
              <th>Доставка</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order._id}>
                <td>
                  <strong>{order.orderNumber}</strong>
                </td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{order.customer.fullName}</div>
                  <div style={{ fontSize: '0.85rem', color: '#888' }}>{order.customer.phone}</div>
                </td>
                <td>
                  <strong>{order.total} ₽</strong>
                </td>
                <td>
                  {order.payment.status === 'paid' ? (
                    <span className={`${styles.badge} ${styles.statusPaid}`}>Оплачен</span>
                  ) : order.payment.status === 'failed' ? (
                    <span className={`${styles.badge} ${styles.statusCancelled}`}>Ошибка</span>
                  ) : (
                    <span className={`${styles.badge} ${styles.statusPending}`}>Ожидает</span>
                  )}
                </td>
                <td>
                  {order.delivery.trackNumber ? (
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>
                      {order.delivery.trackNumber}
                    </span>
                  ) : (
                    <span style={{ color: '#aaa' }}>—</span>
                  )}
                </td>
                <td>
                  <button
                    className={styles.detailsBtn}
                    onClick={() => setSelectedOrder(order)}
                  >
                    Подробнее
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders?.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📦</div>
            <div className={styles.emptyText}>Заказов пока нет</div>
            <div style={{ fontSize: '0.9rem' }}>
              Как только клиент оформит заказ, он появится здесь.
            </div>
          </div>
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