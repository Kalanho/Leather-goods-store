import { useState, useRef, useEffect } from 'react';
import styles from './ProductGallery.module.css';

interface Props {
  images: string[];
  mobileImages?: string[];
  alt: string;
  externalImage?: string;   // если задано — галерея переключается на это фото
}

export const ProductGallery = ({ images, mobileImages, alt, externalImage }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const displayImages =
    isMobile && mobileImages && mobileImages.length > 0 ? mobileImages : images;

  // 🔑 Синхронизация с внешним изображением (выбор цвета)
  useEffect(() => {
    if (!externalImage || !displayImages) return;
    const idx = displayImages.indexOf(externalImage);
    if (idx >= 0 && idx !== activeIndex) {
      setActiveIndex(idx);
    }
  }, [externalImage, displayImages, activeIndex]);

  if (!displayImages || displayImages.length === 0) {
    return <div className={styles.placeholder}>Нет изображения</div>;
  }

  const goTo = (index: number) => {
    if (index < 0) index = displayImages.length - 1;
    if (index >= displayImages.length) index = 0;
    setActiveIndex(index);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) goTo(activeIndex + 1);
    else if (diff < -50) goTo(activeIndex - 1);
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className={styles.gallery}>
      {!isMobile && displayImages.length > 1 && (
        <div className={styles.thumbs}>
          {displayImages.map((img, i) => (
            <button
              key={i}
              className={i === activeIndex ? styles.thumbActive : styles.thumb}
              onClick={() => setActiveIndex(i)}
              aria-label={`Фото ${i + 1}`}
            >
              <img src={img} alt={`${alt} — фото ${i + 1}`} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <div
        className={styles.main}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img src={displayImages[activeIndex]} alt={alt} className={styles.mainImage} />

        {!isMobile && displayImages.length > 1 && (
          <>
            <button
              className={`${styles.arrow} ${styles.arrowPrev}`}
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Предыдущее фото"
            >‹</button>
            <button
              className={`${styles.arrow} ${styles.arrowNext}`}
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Следующее фото"
            >›</button>
          </>
        )}
      </div>

      {isMobile && displayImages.length > 1 && (
        <div className={styles.dots}>
          {displayImages.map((_, i) => (
            <button
              key={i}
              className={i === activeIndex ? styles.dotActive : styles.dot}
              onClick={() => setActiveIndex(i)}
              aria-label={`Перейти к фото ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};