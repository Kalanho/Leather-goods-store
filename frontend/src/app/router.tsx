import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/shared/layout/Layout';
import { HomePage } from '@/features/home/HomePage';
import { CatalogPage } from '@/features/catalog/CatalogPage';
import { ProductPage } from '@/features/product/ProductPage';
import { CartPage } from '@/features/cart/CartPage';
import { CheckoutPage } from '@/features/checkout/CheckoutPage';
import { AboutPage } from '@/features/static/AboutPage';
import { ArticlesPage } from '@/features/static/ArticlesPage';
import { InfoPage } from '@/features/static/InfoPage';
import { ContactsPage } from '@/features/static/ContactsPage';
import { NotFoundPage } from '@/features/static/NotFoundPage';

// Импорты админки
import { LoginPage } from '@/features/admin/LoginPage';
import { ProtectedRoute } from '@/features/admin/ProtectedRoute';
import { AdminLayout } from '@/features/admin/AdminLayout';
import { AdminProductsPage } from '@/features/admin/AdminProductsPage';

export const AppRouter = () => {
  return (
    <Routes>
      {/* === ПУБЛИЧНЫЙ САЙТ === */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* === АДМИНКА === */}
      <Route path="/admin/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          {/* При заходе на /admin редиректим на /admin/products */}
          <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          
          {/* Заглушка для остальных страниц админки */}
          <Route path="/admin/products/new" element={<div>Форма добавления (следующий шаг)</div>} />
          <Route path="/admin/orders" element={<div>Заказы (следующий шаг)</div>} />
        </Route>
      </Route>
    </Routes>
  );
};