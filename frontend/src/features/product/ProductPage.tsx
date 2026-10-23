import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductBySlug } from '@/api/products';
import { ProductGallery } from './components/ProductGallery';
import { ColorSwatches } from './components/ColorSwatches';
import { useProductSelection } from './hooks/useProductSelection';
import styles from './ProductPage.module.css';

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });

  const selection = useProductSelection(product);

  if (isLoading) return <div className="container">Загрузка…</div>;
  if (isError) return <div className="container">Ошибка: {(error as Error).message}</div>;
  if (!product) return <div className="container">Товар не найден</div>;

  const currentPrice =
    selection.selectedVariant?.price ?? product.basePrice;

  const stock = selection.selectedVariant?.stock ?? 0;
  const isOutOfStock = stock === 0;

  return (
    <div className="container">
      <div className={styles.layout}>
        <div className={styles.galleryCol}>
          <ProductGallery
            images={product.images}
            mobileImages={product.mobileImages}
            alt={product.name}
            externalImage={selection.selectedImage}
          />
        </div>

        <div className={styles.infoCol}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.short}>{product.shortDescription}</p>

          <div className={styles.priceBlock}>
            <span className={styles.price}>{currentPrice} ₽</span>
            {product.isPreOrder && product.productionDays && (
              <span className={styles.preorder}>
                Предзаказ · ~{product.productionDays} дн.
              </span>
            )}
          </div>

          <div className={styles.divider} />

          <ColorSwatches
            colors={selection.colors}
            selected={selection.selectedColor}
            onSelect={selection.setSelectedColor}
          />

          {/* Размер, гравировка, коробка, кнопка «В корзину» — следующим шагом */}

          <div className={styles.stock}>
            {isOutOfStock ? (
              <span className={styles.outOfStock}>Нет в наличии</span>
            ) : (
              <span className={styles.inStock}>
                В наличии: {stock} шт.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};