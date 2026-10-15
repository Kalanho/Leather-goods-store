import { useProducts } from './hooks/useProducts';
import { FiltersSidebar } from './components/FiltersSidebar';
import { ProductCard } from './components/ProductCard';
import { SkeletonCard } from './components/SkeletonCard';
import { SortDropdown } from './components/SortDropdown';
import { Pagination } from './components/Pagination';
import styles from './CatalogPage.module.css';

export const CatalogPage = () => {
  const { data, isLoading, isError, error } = useProducts();

  return (
    <div className="container">
      <div className={styles.head}>
        <h1 className={styles.title}>Каталог</h1>
        <SortDropdown />
      </div>

      <div className={styles.layout}>
        <FiltersSidebar />

        <div className={styles.content}>
          {isLoading && (
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {isError && (
            <div className={styles.error}>
              Не удалось загрузить товары: {(error as Error).message}
            </div>
          )}

          {!isLoading && !isError && data?.data.length === 0 && (
            <div className={styles.empty}>
              <p>По вашим фильтрам ничего не найдено.</p>
              <p>Попробуйте сбросить параметры или выбрать другую категорию.</p>
            </div>
          )}

          {!isLoading && !isError && data && data.data.length > 0 && (
            <>
              <div className={styles.grid}>
                {data.data.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              <Pagination page={data.pagination.page} pages={data.pagination.pages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};