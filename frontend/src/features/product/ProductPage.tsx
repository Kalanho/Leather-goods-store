import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductBySlug } from '@/api/products';
import { ProductGallery } from './components/ProductGallery';
import { useCartStore } from '@/store/cartStore';
import styles from './ProductPage.module.css';

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });

  // === СОСТОЯНИЯ ВЫБОРА ===
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [engraving, setEngraving] = useState('');
  const [wantEngraving, setWantEngraving] = useState(false);
  const [wantGiftBox, setWantGiftBox] = useState(false);

  // Устанавливаем первый доступный цвет при загрузке
  useEffect(() => {
    if (product && product.variants.length > 0 && !selectedColor) {
      setSelectedColor(product.variants[0].color);
    }
  }, [product, selectedColor]);

  // Находим текущий выбранный вариант (цвет + размер)
  const activeVariant = useMemo(() => {
    if (!product) return null;
    return product.variants.find(
      (v) => v.color === selectedColor && (selectedSize ? v.size === selectedSize : true)
    ) || product.variants.find((v) => v.color === selectedColor);
  }, [product, selectedColor, selectedSize]);

  // Список доступных размеров для выбранного цвета
  const availableSizes = useMemo(() => {
    if (!product) return [];
    return product.variants
      .filter((v) => v.color === selectedColor && v.size)
      .map((v) => v.size as string);
  }, [product, selectedColor]);

  // Сбрасываем размер, если при смене цвета его нет
  useEffect(() => {
    if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0]);
    } else if (availableSizes.length === 0) {
      setSelectedSize('');
    }
  }, [availableSizes, selectedSize]);

  // === РАСЧЕТ ЦЕНЫ ===
  const priceData = useMemo(() => {
    if (!product || !activeVariant) return { base: 0, engravingPrice: 0, boxPrice: 0, total: 0 };

    const base = activeVariant.price;
    
    // Гравировка
    const persOpt = product.personalizationOptions.find((o) => o.type === 'text' && o.isActive);
    const engravingPrice = wantEngraving && persOpt ? persOpt.price : 0;

    // Коробка (пока ставим фиксированную 500 руб., позже подтянем из БД реальный товар)
    const boxPrice = wantGiftBox ? 500 : 0;

    return { base, engravingPrice, boxPrice, total: base + engravingPrice + boxPrice };
  }, [product, activeVariant, wantEngraving, wantGiftBox]);

  // === ДОБАВЛЕНИЕ В КОРЗИНУ ===
  const handleAddToCart = () => {
    if (!product || !activeVariant) return;

    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: activeVariant.image || product.images[0],
      variantSku: activeVariant.sku,
      color: activeVariant.color,
      size: activeVariant.size,
      price: activeVariant.price,
      quantity: 1,
      personalization: wantEngraving && engraving.trim() ? {
        type: 'text',
        value: engraving.trim(),
        price: priceData.engravingPrice
      } : undefined,
      giftBox: wantGiftBox,
      giftBoxPrice: wantGiftBox ? 500 : 0,
    });

    navigate('/cart'); // Переходим в корзину
  };

  if (isLoading) return <div className="container" style={{padding: '48px 0'}}>Загрузка…</div>;
  if (isError || !product) return <div className="container" style={{padding: '48px 0'}}>Товар не найден</div>;

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <div className={styles.layout}>
        {/* ЛЕВАЯ КОЛОНКА: ГАЛЕРЕЯ */}
        <div className={styles.galleryCol}>
          <ProductGallery
            images={product.images}
            mobileImages={product.mobileImages}
            alt={product.name}
          />
        </div>

        {/* ПРАВАЯ КОЛОНКА: ИНФО И ПОКУПКА */}
        <div className={styles.infoCol}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.short}>{product.shortDescription}</p>

          <div className={styles.priceBlock}>
            <span className={styles.price}>{priceData.total} ₽</span>
            {product.isPreOrder && (
              <span className={styles.preOrder}>Предзаказ · {product.productionDays} дн.</span>
            )}
          </div>

          <div className={styles.divider} />

          {/* ВЫБОР ЦВЕТА */}
          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>Цвет: <strong>{selectedColor}</strong></span>
            <div className={styles.colors}>
              {Array.from(new Set(product.variants.map(v => v.color))).map(color => (
                <button
                  key={color}
                  className={selectedColor === color ? styles.colorActive : styles.colorBtn}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* ВЫБОР РАЗМЕРА (если есть) */}
          {availableSizes.length > 0 && (
            <div className={styles.optionGroup}>
              <span className={styles.optionLabel}>Размер</span>
              <div className={styles.sizes}>
                {availableSizes.map(size => (
                  <button
                    key={size}
                    className={selectedSize === size ? styles.sizeActive : styles.sizeBtn}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ГРАВИРОВКА */}
          {product.personalizationOptions.length > 0 && (
            <div className={styles.optionGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={wantEngraving}
                  onChange={(e) => setWantEngraving(e.target.checked)}
                />
                Добавить гравировку (+{product.personalizationOptions[0]?.price} ₽)
              </label>
              
              {wantEngraving && (
                <input
                  type="text"
                  placeholder="Введите текст для гравировки"
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value)}
                  maxLength={product.personalizationOptions[0]?.maxLength || 20}
                  className={styles.engravingInput}
                />
              )}
            </div>
          )}

          {/* ПОДАРОЧНАЯ КОРОБКА */}
          {product.giftBoxAvailable && (
            <div className={styles.optionGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={wantGiftBox}
                  onChange={(e) => setWantGiftBox(e.target.checked)}
                />
                Подарочная упаковка (+500 ₽)
              </label>
            </div>
          )}

          {/* КНОПКА В КОРЗИНУ */}
          <button 
            onClick={handleAddToCart} 
            className={styles.buyBtn}
            disabled={!activeVariant || activeVariant.stock === 0}
          >
            {activeVariant?.stock === 0 ? 'Нет в наличии' : 'Добавить в корзину'}
          </button>

          {/* ХАРАКТЕРИСТИКИ */}
          <div className={styles.specs}>
            <h4>Характеристики</h4>
            <p><strong>Материал:</strong> {product.material}</p>
            {product.careInstructions && (
              <p><strong>Уход:</strong> {product.careInstructions}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};