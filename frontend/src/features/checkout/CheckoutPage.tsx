import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCartStore } from '@/store/cartStore';
import { createOrder } from '@/api/orders';
import styles from './CheckoutPage.module.css'; // <-- ВАЖНО: правильный импорт

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  postalCode?: string;
  comment?: string;
  deliveryProvider: 'cdek' | 'pickup';
}

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      deliveryProvider: 'cdek',
    }
  });

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) {
      setError('Корзина пуста');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        customer: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          city: data.city,
          address: data.address,
          postalCode: data.postalCode,
          comment: data.comment,
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantSku: item.variantSku,
          quantity: item.quantity,
          personalization: item.personalization ? {
            type: item.personalization.type,
            value: item.personalization.value
          } : undefined,
          giftBox: item.giftBox,
        })),
        delivery: {
          provider: data.deliveryProvider,
          method: data.deliveryProvider === 'cdek' ? 'ПВЗ' : 'Самовывоз',
        },
        payment: {
          provider: 'yookassa',
        },
        deliveryPrice: 0,
      };

      const response = await createOrder(payload);
      
      clearCart();
      navigate(`/thank-you?order=${response.orderNumber}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1>Корзина пуста</h1>
        <Link to="/catalog" style={{ color: 'var(--color-leather)' }}>Вернуться в каталог</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <h1 className={styles.title}>Оформление заказа</h1>

      <div className={styles.layout}>
        {/* ФОРМА */}
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <section className={styles.section}>
            <h2>Контактные данные</h2>
            
            <div className={styles.row}>
              <label className={styles.field}>
                ФИО *
                <input {...register('fullName', { required: 'Укажите ФИО' })} />
                {errors.fullName && <span className={styles.error}>{errors.fullName.message}</span>}
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.field}>
                Телефон *
                <input type="tel" placeholder="+7 (999) 000-00-00" {...register('phone', { required: 'Укажите телефон' })} />
                {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
              </label>
              <label className={styles.field}>
                Email *
                <input type="email" {...register('email', { required: 'Укажите email' })} />
                {errors.email && <span className={styles.error}>{errors.email.message}</span>}
              </label>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Доставка</h2>
            
            <div className={styles.radioGroup}>
              <label className={styles.radio}>
                <input type="radio" value="cdek" {...register('deliveryProvider')} />
                СДЭК (доставка по России)
              </label>
              <label className={styles.radio}>
                <input type="radio" value="pickup" {...register('deliveryProvider')} />
                Самовывоз (адрес мастерской)
              </label>
            </div>

            <div className={styles.row}>
              <label className={styles.field}>
                Город *
                <input {...register('city', { required: 'Укажите город' })} />
                {errors.city && <span className={styles.error}>{errors.city.message}</span>}
              </label>
              <label className={styles.field}>
                Индекс
                <input {...register('postalCode')} />
              </label>
            </div>

            <label className={styles.field}>
              Адрес (улица, дом, квартира) *
              <input {...register('address', { required: 'Укажите адрес' })} />
              {errors.address && <span className={styles.error}>{errors.address.message}</span>}
            </label>

            <label className={styles.field}>
              Комментарий к заказу
              <textarea rows={3} {...register('comment')} />
            </label>
          </section>
        </form>

        {/* БОКОВАЯ ПАНЕЛЬ */}
        <div className={styles.summary}>
          <h2>Ваш заказ</h2>
          
          <div className={styles.items}>
            {items.map((item, i) => (
              <div key={i} className={styles.item}>
                <span>{item.name} ({item.color}) × {item.quantity}</span>
                <span>{item.price * item.quantity} ₽</span>
              </div>
            ))}
          </div>

          <div className={styles.total}>
            <span>Итого:</span>
            <strong>{getTotal()} ₽</strong>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <button 
            type="submit" 
            form="checkout-form" 
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Оформление…' : 'Подтвердить заказ'}
          </button>

          <p className={styles.note}>
            Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных.
          </p>
        </div>
      </div>
    </div>
  );
};