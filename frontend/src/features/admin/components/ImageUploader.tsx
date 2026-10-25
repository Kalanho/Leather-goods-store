import { useState } from 'react';
import { uploadProductImages } from '@/api/admin';
import styles from './ImageUploader.module.css';

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export const ImageUploader = ({ value = [], onChange }: Props) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const newUrls = await uploadProductImages(files);
      onChange([...value, ...newUrls]);
    } catch (err) {
      alert('Ошибка загрузки: ' + (err as Error).message);
    } finally {
      setUploading(false);
      e.target.value = ''; // сброс инпута
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {value.map((url, i) => (
          <div key={url} className={styles.imageBox}>
            <img src={url} alt={`Фото ${i + 1}`} />
            <button type="button" onClick={() => removeImage(i)} className={styles.removeBtn}>
              ×
            </button>
          </div>
        ))}

        <label className={styles.uploadBox}>
          {uploading ? '...' : '+ Фото'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            hidden
          />
        </label>
      </div>
    </div>
  );
};