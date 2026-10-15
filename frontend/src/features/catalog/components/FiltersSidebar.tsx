import { useSearchParams } from 'react-router-dom';
import styles from './FiltersSidebar.module.css';

const SUB_CATEGORIES = [
  { slug: 'documents', name: 'Для документов' },
  { slug: 'wallets', name: 'Кошельки' },
  { slug: 'belts', name: 'Ремни' },
  { slug: 'bags', name: 'Сумки' },
  { slug: 'gift_sets', name: 'Подарочные наборы' },
  { slug: 'accessories', name: 'Кожаные аксессуары' },
  { slug: 'gift_boxes', name: 'Подарочные упаковки' },
];

const COLORS = ['Чёрный', 'Cognac', 'Шоколад', 'Бордо', 'Натуральный'];

const MATERIALS = [
  { value: 'genuine_leather', label: 'Натуральная кожа' },
  { value: 'faux_leather', label: 'Экокожа' },
];

export const FiltersSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const update = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page'); // сброс страницы при смене фильтра
    setSearchParams(next);
  };

  const current = (key: string) => searchParams.get(key);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Категории</h4>
        <ul>
          <li>
            <button
              className={!current('subCategory') ? styles.active : ''}
              onClick={() => update('subCategory', undefined)}
            >
              Все изделия
            </button>
          </li>
          {SUB_CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <button
                className={current('subCategory') === cat.slug ? styles.active : ''}
                onClick={() => update('subCategory', cat.slug)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Цена</h4>
        <div className={styles.priceRow}>
          <input
            type="number"
            placeholder="от"
            defaultValue={current('minPrice') || ''}
            onBlur={(e) => update('minPrice', e.target.value || undefined)}
          />
          <input
            type="number"
            placeholder="до"
            defaultValue={current('maxPrice') || ''}
            onBlur={(e) => update('maxPrice', e.target.value || undefined)}
          />
        </div>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Цвет</h4>
        <div className={styles.colors}>
          {COLORS.map((color) => (
            <button
              key={color}
              className={current('color') === color ? styles.colorActive : styles.colorBtn}
              onClick={() =>
                update('color', current('color') === color ? undefined : color)
              }
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Материал</h4>
        {MATERIALS.map((m) => (
          <label key={m.value} className={styles.checkbox}>
            <input
              type="checkbox"
              checked={current('material') === m.value}
              onChange={() =>
                update('material', current('material') === m.value ? undefined : m.value)
              }
            />
            {m.label}
          </label>
        ))}
      </div>

      <button
        className={styles.reset}
        onClick={() => setSearchParams(new URLSearchParams())}
      >
        Сбросить фильтры
      </button>
    </aside>
  );
};