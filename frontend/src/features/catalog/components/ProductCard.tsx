import { Link } from 'react-router-dom';
import type { Product } from '@/types';
import styles from './ProductCard.module.css';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const image = product.images[0] || 'https://via.placeholder.com/400x400?text=Manticore';
  const hasDiscount = product.discountPrice && product.discountPrice < product.basePrice;

  return (
    <Link to={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={image} alt={product.name} loading="lazy" className={styles.image} />

        {product.isPreOrder && (
          <span className={styles.badgePreOrder}>Предзаказ</span>
        )}
        {hasDiscount && (
          <span className={styles.badgeDiscount}>Скидка</span>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.short}>{product.shortDescription}</p>

        <div className={styles.bottom}>
          <div className={styles.prices}>
            {hasDiscount ? (
              <>
                <span className={styles.oldPrice}>{product.basePrice} ₽</span>
                <span className={styles.price}>{product.discountPrice} ₽</span>
              </>
            ) : (
              <span className={styles.price}>{product.basePrice} ₽</span>
            )}
          </div>

          {product.isPreOrder && product.productionDays && (
            <span className={styles.days}>~{product.productionDays} дн.</span>
          )}
        </div>
      </div>
    </Link>
  );
};