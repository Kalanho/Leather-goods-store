import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import styles from './AdminLayout.module.css';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const admin = useAuthStore((s) => s.admin);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={styles.layout}>
      {/* Сайдбар */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          MANTICORE<br />
          <span className={styles.brandSub}>ADMIN</span>
        </div>

        <nav className={styles.nav}>
          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => isActive ? styles.active : styles.link}
          >
            Товары
          </NavLink>
          <NavLink 
            to="/admin/orders" 
            className={({ isActive }) => isActive ? styles.active : styles.link}
          >
            Заказы
          </NavLink>
        </nav>

        <div className={styles.bottom}>
          <div className={styles.user}>{admin?.name || admin?.email}</div>
          <button onClick={handleLogout} className={styles.logout}>
            Выйти
          </button>
        </div>
      </aside>

      {/* Контентная часть */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};