import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import styles from './Layout.module.css';

export const Layout = () => {
  const count = useCartStore((s) => s.getCount());
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 1. Закрываем меню при смене страницы
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // 2. Закрываем по Escape и блокируем скролл
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // 3. Закрываем меню при ресайзе > 768px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { to: '/catalog', label: 'Каталог' },
    { to: '/about', label: 'О нас' },
    { to: '/articles', label: 'Статьи' },
    { to: '/info', label: 'Покупателю' },
    { to: '/contacts', label: 'Контакты' },
  ];

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Логотип */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoMain}>ПОЛЕЩУК</span>
            <span className={styles.logoTagline}>изделия из кожи</span>
          </Link>

          {/* Навигация для десктопа */}
          <nav className={styles.desktopNav}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Действия */}
          <div className={styles.actions}>
            <a href="tel:+79001234567" className={styles.phone}>+7 (900) 123-45-67</a>
            <Link to="/cart" className={styles.cart}>
              Корзина {count > 0 && <span className={styles.badge}>{count}</span>}
            </Link>
            
            {/* Бургер для мобилок */}
            <button
              className={styles.burgerBtn}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Меню"
            >
              <div className={`${styles.burgerIcon} ${isMenuOpen ? styles.burgerOpen : ''}`}>
                <span />
                <span />
                <span />
              </div>
            </button>
          </div>
        </div>

        {/* Мобильное меню (выпадающее) */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? styles.mobileActive : styles.mobileLink)}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <a href="tel:+79001234567" className={styles.mobilePhone}>+7 (900) 123-45-67</a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <div className={styles.footerLogo}>ПОЛЕЩУК</div>
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
        <div className={styles.copy}>© {new Date().getFullYear()} Полещук</div>
      </footer>
    </div>
  );
};