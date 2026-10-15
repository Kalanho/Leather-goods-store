import { Routes, Route } from 'react-router-dom';
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

export const AppRouter = () => {
  return (
    <Routes>
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
    </Routes>
  );
};