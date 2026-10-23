import styles from './ColorSwatches.module.css';

interface Props {
  colors: string[];
  selected: string;
  onSelect: (color: string) => void;
}

// Маппинг известных цветов на CSS-значения для кружков
const COLOR_MAP: Record<string, string> = {
  'Чёрный': '#1a1a1a',
  'Черный': '#1a1a1a',
  'Cognac': '#8b5a2b',
  'Коньяк': '#8b5a2b',
  'Шоколад': '#5c3a21',
  'Бордо': '#6b1f2a',
  'Натуральный': '#c9a877',
  'Коричневый': '#7a4a25',
  'Бежевый': '#d9c5a0',
};

const getSwatchColor = (name: string): string => {
  return COLOR_MAP[name] || '#cccccc'; // fallback — серый
};

export const ColorSwatches = ({ colors, selected, onSelect }: Props) => {
  if (colors.length <= 1) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>
        Цвет: <span className={styles.value}>{selected}</span>
      </div>

      <div className={styles.swatches}>
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            className={color === selected ? styles.swatchActive : styles.swatch}
            onClick={() => onSelect(color)}
            aria-label={`Цвет: ${color}`}
            title={color}
          >
            <span
              className={styles.swatchDot}
              style={{ background: getSwatchColor(color) }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};