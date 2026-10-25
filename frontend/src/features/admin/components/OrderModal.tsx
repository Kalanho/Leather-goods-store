import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { updateOrderStatusApi } from '@/api/adminOrders';
import styles from './OrderModal.module.css';

export const OrderModal = ({ order, onClose }: { order: any; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const [trackNumber, setTrackNumber] = useState(order.delivery.trackNumber || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (updates: any) => {
    setLoading(true);
    try {
      await updateOrderStatusApi(order._id, updates);
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      onClose();
    } catch (e) {
      alert('Ошибка: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrack = () => {
    handleUpdate({ trackNumber, deliveryStatus: 'shipped' });
  };

  const handleMarkPaid = () => {
    handleUpdate({ paymentStatus: 'paid' });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Заказ {order.orderNumber}</h2>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>

        <div className={styles.content}>
          {/* КЛИЕНТ */}
          <div className={styles.block}>
            <h4>Клиент</h4>
            <p><strong>Имя:</strong> {order.customer.fullName}</p>
            <p><strong>Телефон:</strong> {order.customer.phone}</p>
            <p><strong>Email:</strong> {order.customer.email}</p>
            <p><strong>Адрес:</strong> {order.customer.city}, {order.customer.address}</p>
            {order.customer.comment && <p><strong>Комментарий:</strong> {order.customer.comment}</p>}
          </div>

          {/* СОСТАВ ЗАКАЗА */}
          <div className={styles.block}>
            <h4>Состав заказа</h4>
            {order.items.map((item: any, i: number) => (
              <div key={i} className={styles.item}>
                <div>
                  <strong>{item.productId?.name || 'Товар удален'}</strong>
                  <br />
                  <small>{item.color} {item.size && `/ ${item.size}`}</small>
                  {item.personalization && (
                    <div className={styles.option}>Гравировка: "{item.personalization.value}"</div>
                  )}
                  {item.giftBox && <div className={styles.option}>+ Подарочная коробка</div>}
                </div>
                <div>
                  {item.quantity} шт. × {item.price} ₽
                </div>
              </div>
            ))}
            <div className={styles.total}>
              <strong>Итого: {order.total} ₽</strong>
            </div>
          </div>

          {/* УПРАВЛЕНИЕ */}
          <div className={styles.block}>
            <h4>Управление</h4>
            <div className={styles.actions}>
              <div>
                <span>Оплата: </span>
                <strong>{order.payment.status}</strong>
                {order.payment.status !== 'paid' && (
                  <button onClick={handleMarkPaid} disabled={loading} className={styles.btn}>
                    Отметить оплаченным
                  </button>
                )}
              </div>
              
              <div className={styles.trackRow}>
                <input
                  type="text"
                  placeholder="Трек-номер СДЭК"
                  value={trackNumber}
                  onChange={(e) => setTrackNumber(e.target.value)}
                />
                <button onClick={handleSaveTrack} disabled={loading} className={styles.btn}>
                  Сохранить трек
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};