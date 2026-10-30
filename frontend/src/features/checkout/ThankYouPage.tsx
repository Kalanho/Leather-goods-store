import { Link, useSearchParams } from 'react-router-dom';
import styles from './ThankYouPage.module.css';

export const ThankYouPage = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>
        <h1 className={styles.title}>Спасибо за заказ!</h1>
        
        {orderNumber ? (
          <p className={styles.text}>
            Ваш заказ <strong>№ {orderNumber}</strong> успешно оформлен.
            <br />
            Мы свяжемся с вами в ближайшее время для подтверждения.
          </p>
        ) : (
          <p className={styles.text}>Ваш заказ успешно оформлен.</p>
        )}

        <p className={styles.subtext}>
          Поскольку товары изготавливаются по предзаказу, мы уведомим вас, когда заказ будет готов к отправке.
        </p>

        <Link to="/catalog" className={styles.btn}>
          Вернуться в каталог
        </Link>
      </div>
    </div>
  );
};