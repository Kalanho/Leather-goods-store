import styles from './SkeletonCard.module.css';

export const SkeletonCard = () => (
  <div className={styles.card}>
    <div className={styles.image} />
    <div className={styles.info}>
      <div className={styles.line} />
      <div className={styles.lineShort} />
    </div>
  </div>
);