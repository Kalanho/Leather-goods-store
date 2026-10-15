import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const CATEGORIES = [
  { slug: 'documents', name: 'Для документов' },
  { slug: 'wallets', name: 'Кошельки' },
  { slug: 'belts', name: 'Ремни' },
  { slug: 'bags', name: 'Сумки' },
  { slug: 'gift_sets', name: 'Подарочные наборы' },
  { slug: 'accessories', name: 'Кожаные аксессуары' },
  { slug: 'gift_boxes', name: 'Подарочные упаковки' },
];

const ADVANTAGES = [
  { title: 'Натуральная кожа', text: 'Растительное дубление, ручная работа' },
  { title: 'Бесплатная гравировка', text: 'Инициалы или логотип на изделии' },
  { title: 'Бесплатная доставка', text: 'Транспортной компанией по России' },
  { title: 'Предзаказ', text: 'Индивидуальные сроки изготовления' },
];

export const HomePage = () => {
  return (
    <div>
      {/* Баннер под акции */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>Глава 1 · Понимание кожи</div>
          <h1 className={styles.heroTitle}>
            Изделия из кожи,<br />
            которые <em>стареют красиво</em>
          </h1>
          <p className={styles.heroText}>
            Ручная работа, натуральные материалы, благородная патина времени.
          </p>
          <Link to="/catalog" className={styles.heroCta}>Смотреть каталог →</Link>
        </div>
      </section>

      {/* Разделы каталога */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Разделы каталога</h2>
        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} to={`/catalog?subCategory=${cat.slug}`} className={styles.categoryCard}>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Преимущества */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Почему Manticore</h2>
        <div className={styles.advantages}>
          {ADVANTAGES.map((adv) => (
            <div key={adv.title} className={styles.advantage}>
              <h3>{adv.title}</h3>
              <p>{adv.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ТОП продаж */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ТОП продаж</h2>
        <p className={styles.placeholder}>[Скоро: товары с флагом isTopSelling]</p>
      </section>

      {/* Статьи */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Журнал</h2>
        <p className={styles.placeholder}>[Скоро: блок статей]</p>
      </section>
    </div>
  );
};