import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import styles from './CartPage.module.css';

export const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>Корзина пуста</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
          Самое время выбрать что-то из нашей коллекции.
        </p>
        <Link 
          to="/catalog" 
          style={{ 
            display: 'inline-block', 
            padding: '14px 32px', 
            background: 'var(--color-dark)', 
            color: '#fff',
            textDecoration: 'none'
          }}
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 48 }}>
      <h1 className={styles.title}>Корзина</h1>

      <div className={styles.layout}>
        {/* СПИСОК ТОВАРОВ */}
        <div className={styles.itemsList}>
          {items.map((item, index) => {
            // Уникальный ключ, так как один товар может быть с разной гравировкой
            const itemKey = `${item.variantSku}-${index}`;

            return (
              <div key={itemKey} className={styles.item}>
                <div className={styles.imageWrap}>
                  <img src={item.image} alt={item.name} />
                </div>

                <div className={styles.info}>
                  <Link to={`/product/${item.slug}`} className={styles.itemName}>
                    {item.name}
                  </Link>
                  
                  <div className={styles.variantInfo}>
                    {item.color} {item.size && `/ ${item.size}`}
                  </div>

                  {item.personalization && (
                    <div className={styles.option}>
                      Гравировка: "{item.personalization.value}"
                    </div>
                  )}
                  {item.giftBox && (
                    <div className={styles.option}>
                      + Подарочная коробка
                    </div>
                  )}

                  <button 
                    onClick={() => removeItem(item.variantSku)}
                    className={styles.removeBtn}
                  >
                    Удалить
                  </button>
                </div>

                <div className={styles.quantity}>
                  <button onClick={() => updateQuantity(item.variantSku, Math.max(1, item.quantity - 1))}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.variantSku, item.quantity + 1)}>
                    +
                  </button>
                </div>

                <div className={styles.price}>
                  {(item.price * item.quantity) + 
                   (item.personalization ? item.personalization.price : 0) + 
                   (item.giftBox && item.giftBoxPrice ? item.giftBoxPrice : 0)} ₽
                </div>
              </div>
            );
          })}
        </div>

        {/* БОКОВАЯ ПАНЕЛЬ С ИТОГОМ */}
        <div className={styles.summary}>
          <h2>Итого</h2>
          
          <div className={styles.summaryRow}>
            <span>Товары</span>
            <span>{total} ₽</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Доставка</span>
            <span>Рассчитывается при оформлении</span>
          </div>
          
          <div className={styles.summaryTotal}>
            <span>К оплате</span>
            <strong>{total} ₽</strong>
          </div>

          <button 
            onClick={() => navigate('/checkout')} 
            className={styles.checkoutBtn}
          >
            Перейти к оформлению
          </button>
        </div>
      </div>
    </div>
  );
};