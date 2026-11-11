import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductBySlug } from '@/api/products';
import { useCartStore } from '@/store/cartStore';
import { ProductGallery } from './components/ProductGallery';
import styles from './ProductPage.module.css';

export const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const addItem = useCartStore((state) => state.addItem);

  // Загружаем товар
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });

  // Состояния для выбора опций
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [personalization, setPersonalization] = useState('');
  const [addGiftBox, setAddGiftBox] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Когда товар загрузился, выбираем первый вариант по умолчанию
  useEffect(() => {
    if (product && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product, selectedVariant]);

  if (isLoading) return <div className="container" style={{ padding: '64px 0' }}>Загрузка...</div>;
  if (isError || !product) return <div className="container" style={{ padding: '64px 0' }}>Товар не найден</div>;

  // Считаем итоговую цену
  const basePrice = selectedVariant ? selectedVariant.price : product.basePrice;
  
  let personalizationPrice = 0;
  if (personalization && product.personalizationOptions?.length > 0) {
    const textOption = product.personalizationOptions.find((o: any) => o.type === 'text');
    if (textOption) personalizationPrice = textOption.price;
  }

  const giftBoxPrice = addGiftBox ? 500 : 0; // Пока фикс цена, позже можно вытащить из БД
  const totalPrice = (basePrice + personalizationPrice + giftBoxPrice) * quantity;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] || '',
      variantSku: selectedVariant.sku,
      color: selectedVariant.colorName, // Используем новое поле
      size: selectedVariant.size,
      price: basePrice,
      quantity,
      personalization: personalization ? { type: 'text', value: personalization, price: personalizationPrice } : undefined,
      giftBox: addGiftBox,
      giftBoxPrice,
    });

    alert('Товар добавлен в корзину!');
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.layout}>
        {/* Левая часть: Галерея */}
        <div className={styles.galleryCol}>
          <ProductGallery images={product.images} alt={product.name} />
        </div>

        {/* Правая часть: Информация и опции */}
        <div className={styles.infoCol}>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.shortDesc}>{product.shortDescription}</p>
          
          <div className={styles.price}>{totalPrice} ₽</div>

          {product.isPreOrder && (
            <div className={styles.preOrderBadge}>
              Доступно по предзаказу · Срок изготовления: {product.productionDays} дн.
            </div>
          )}

          {/* ВЫБОР ЦВЕТА (Кружочки) */}
          {product.variants.length > 0 && (
            <div className={styles.optionGroup}>
              <span className={styles.optionLabel}>Цвет: <strong>{selectedVariant?.colorName}</strong></span>
              <div className={styles.colorPalette}>
                {product.variants.map((v: any) => {
                  const isSelected = selectedVariant?.sku === v.sku;
                  return (
                    <button
                      key={v.sku}
                      className={`${styles.colorSwatch} ${isSelected ? styles.colorSwatchActive : ''}`}
                      style={{ backgroundColor: v.colorHex }}
                      onClick={() => setSelectedVariant(v)}
                      title={v.colorName}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* ВЫБОР РАЗМЕРА (если есть) */}
          {selectedVariant?.size && (
             <div className={styles.optionGroup}>
               <span className={styles.optionLabel}>Размер: <strong>{selectedVariant.size}</strong></span>
             </div>
          )}

          {/* ГРАВИРОВКА */}
          {product.personalizationOptions?.length > 0 && (
            <div className={styles.optionGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={!!personalization}
                  onChange={(e) => setPersonalization(e.target.checked ? ' ' : '')}
                />
                Добавить гравировку (+{product.personalizationOptions[0].price} ₽)
              </label>
              
              {personalization !== '' && (
                <input 
                  type="text" 
                  className={styles.personalizationInput}
                  placeholder="Введите текст для гравировки"
                  value={personalization.trim()}
                  onChange={(e) => setPersonalization(e.target.value)}
                  maxLength={product.personalizationOptions[0].maxLength || 20}
                />
              )}
            </div>
          )}

          {/* ПОДАРОЧНАЯ КОРОБКА */}
          {product.giftBoxAvailable && (
            <div className={styles.optionGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={addGiftBox}
                  onChange={(e) => setAddGiftBox(e.target.checked)}
                />
                Упаковать в подарочную коробку (+500 ₽)
              </label>
            </div>
          )}

          {/* КОЛИЧЕСТВО И КНОПКА */}
          <div className={styles.actions}>
            <div className={styles.quantity}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              Добавить в корзину
            </button>
          </div>

          <div className={styles.meta}>
            <p><strong>Материал:</strong> {product.material}</p>
            {product.careInstructions && <p><strong>Уход:</strong> {product.careInstructions}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};