import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTopProducts } from '@/api/products';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import styles from './HomePage.module.css';

const CATEGORIES = [
  { slug: 'belts', name: 'Ремни', image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80' },
  { slug: 'wallets', name: 'Кошельки', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80' },
  { slug: 'bags', name: 'Сумки', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80' },
  { slug: 'gift_sets', name: 'Подарочные наборы', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80' },
];

const ADVANTAGES = [
  { title: 'Натуральная кожа', text: 'Используем только качественное сырьё растительного дубления.' },
  { title: 'Ручная работа', text: 'Каждое изделие создаётся мастером вручную с любовью к деталям.' },
  { title: 'Бесплатная гравировка', text: 'Добавьте инициалы или памятный текст бесплатно при заказе.' },
  { title: 'Доставка по России и СНГ', text: 'Бережно упакуем и отправим транспортной компанией.' },
];

export const HomePage = () => {
  // Загружаем ТОП товары
  const { data: topProducts, isLoading: loadingTop } = useQuery({
    queryKey: ['top-products'],
    queryFn: fetchTopProducts,
  });

  return (
    <div className={styles.page}>
      {/* 1. HERO-БАННЕР */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={`container ${styles.heroContent}`}>
          <span className={styles.heroBadge}>ПОЛЕЩУК Workshop</span>
          <h1 className={styles.heroTitle}>
            Изделия из кожи,<br />
            которые <em>стареют красиво</em>
          </h1>
          <p className={styles.heroText}>
            Брутальные ремни, стильные кошельки и сумки ручной работы. 
            Натуральные материалы, благородная патина времени.
          </p>
          <Link to="/catalog" className={styles.heroCta}>
            Смотреть каталог
          </Link>
        </div>
      </section>

      {/* 2. КАТЕГОРИИ */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2>Изделия из кожи</h2>
          <p>Выберите то, что подчеркнёт ваш стиль</p>
        </div>
        
        <div className={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} to={`/catalog?subCategory=${cat.slug}`} className={styles.categoryCard}>
              <div className={styles.categoryImageWrap}>
                <img src={cat.image} alt={cat.name} loading="lazy" />
              </div>
              <h3 className={styles.categoryName}>{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. ПРЕИМУЩЕСТВА */}
      <section className={styles.advantagesBlock}>
        <div className={`container ${styles.advantagesInner}`}>
          {ADVANTAGES.map((adv, i) => (
            <div key={i} className={styles.advantageItem}>
              <h4>{adv.title}</h4>
              <p>{adv.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ТОП ПРОДАЖ */}
      <section className={`container ${styles.section}`}>
        <div className={styles.sectionHeader}>
          <h2>ТОП продаж</h2>
          <Link to="/catalog" className={styles.viewAll}>Смотреть все →</Link>
        </div>

        {loadingTop ? (
          <div className={styles.loading}>Загрузка популярных товаров…</div>
        ) : (
          <div className={styles.productsGrid}>
            {topProducts?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
            {topProducts?.length === 0 && (
              <p style={{ color: 'var(--color-text-muted)' }}>Пока нет товаров в этой категории.</p>
            )}
          </div>
        )}
      </section>

      {/* 5. О МАСТЕРСКОЙ */}
      <section className={styles.aboutBlock}>
        <div className={`container ${styles.aboutInner}`}>
          <div className={styles.aboutText}>
            <h2>Что вы покупаете у мастерской?</h2>
            <p>
              Мы не производим товары на конвейере. Каждый ремень, кошелёк или сумка — 
              это результат часов ручной работы, внимания к швам, краям и фурнитуре.
            </p>
            <p>
              Натуральная кожа со временем становится только лучше — она покрывается 
              благородной патиной, хранящей следы вашей истории.
            </p>
            <Link to="/about" className={styles.aboutLink}>Узнать больше о нас</Link>
          </div>
          <div className={styles.aboutImage}>
            <img 
              src="https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80" 
              alt="Ручная работа с кожей" 
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 6. СТАТЬИ (Заглушка) */}
      <section className={`container ${styles.section}`} style={{ paddingBottom: 80 }}>
        <div className={styles.sectionHeader}>
          <h2>Журнал</h2>
          <Link to="/articles" className={styles.viewAll}>Все статьи →</Link>
        </div>
        <div className={styles.articlesGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.articleCard}>
              <div className={styles.articleImage}>
                <img 
                  src={`https://images.unsplash.com/photo-${['1549488472264-1d4361602bba', '1528699211-969de2a2b9d5', '1516475180888-1b0d9e84d9b1'][i-1]}?auto=format&fit=crop&w=600&q=80`} 
                  alt="Статья" 
                  loading="lazy"
                />
              </div>
              <div className={styles.articleContent}>
                <span className={styles.articleDate}>12 Октября 2026</span>
                <h3>Как ухаживать за натуральной кожей</h3>
                <Link to="/articles" className={styles.readMore}>Читать →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};