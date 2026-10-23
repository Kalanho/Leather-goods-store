import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export const ProtectedRoute = () => {
  const token = useAuthStore((s) => s.token);

  // Если токена нет — редирект на страницу входа
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Если токен есть — рендерим вложенные роуты (Layout и страницы)
  return <Outlet />;
};