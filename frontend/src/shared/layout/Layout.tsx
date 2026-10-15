import { Link, NavLink, Outlet } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import styles from './Layout.module.css';

export const Layout = () => {
  const count = useCartStore((s) => s.getCount());

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoMain}>MANTICORE</span>
            <span className={styles.logoTagline}>изделия из кожи</span>
          </Link>

          <nav className={styles.nav}>
            <NavLink to="/catalog" className={({isActive}) => isActive ? styles.active : ''}>Каталог</NavLink>
            <NavLink to="/about">О нас</NavLink>
            <NavLink to="/articles">Статьи</NavLink>
            <NavLink to="/info">Покупателю</NavLink>
            <NavLink to="/contacts">Контакты</NavLink>
          </nav>

          <div className={styles.actions}>
            <a href="tel:+79001234567" className={styles.phone}>+7 (900) 123-45-67</a>
            <Link to="/cart" className={styles.cart}>
              Корзина {count > 0 && <span className={styles.badge}>{count}</span>}
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <div className={styles.footerLogo}>MANTICORE</div>
            <p className={styles.footerText}>
              Изделия ручной работы из натуральной кожи.<br />
              Доставка по России и СНГ.
            </p>
          </div>

          <div className={styles.footerCol}>
            <h4>Контакты</h4>
            <a href="tel:+79001234567">+7 (900) 123-45-67</a>
            <a href="mailto:info@manticore.shop">info@manticore.shop</a>
          </div>

          <div className={styles.footerCol}>
            <h4>Мы в сети</h4>
            <a href="https://wa.me/79001234567" target="_blank" rel="noreferrer">WhatsApp</a>
            <a href="https://t.me/manticore" target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
        <div className={styles.copy}>© {new Date().getFullYear()} Manticore.shop</div>
      </footer>
    </div>
  );
};