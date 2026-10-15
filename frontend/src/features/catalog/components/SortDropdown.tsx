import { useSearchParams } from 'react-router-dom';
import styles from './SortDropdown.module.css';

const OPTIONS = [
  { value: '-createdAt', label: 'Новинки' },
  { value: 'basePrice', label: 'Сначала дешёвые' },
  { value: '-basePrice', label: 'Сначала дорогие' },
  { value: 'name', label: 'По названию' },
];

export const SortDropdown = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const current = searchParams.get('sort') || '-createdAt';

  const onChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', value);
    next.delete('page');
    setSearchParams(next);
  };

  return (
    <select
      className={styles.select}
      value={current}
      onChange={(e) => onChange(e.target.value)}
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};