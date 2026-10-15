import { useSearchParams } from 'react-router-dom';
import styles from './Pagination.module.css';

interface Props {
  page: number;
  pages: number;
}

export const Pagination = ({ page, pages }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  if (pages <= 1) return null;

  const goTo = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const numbers: number[] = [];
  for (let i = 1; i <= pages; i++) numbers.push(i);

  return (
    <div className={styles.wrap}>
      <button disabled={page === 1} onClick={() => goTo(page - 1)}>←</button>
      {numbers.map((n) => (
        <button
          key={n}
          className={n === page ? styles.active : ''}
          onClick={() => goTo(n)}
        >
          {n}
        </button>
      ))}
      <button disabled={page === pages} onClick={() => goTo(page + 1)}>→</button>
    </div>
  );
};