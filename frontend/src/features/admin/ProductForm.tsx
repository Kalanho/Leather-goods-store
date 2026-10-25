import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import type { Product } from '@/types';
import { ImageUploader } from './components/ImageUploader';
import styles from './ProductForm.module.css';

interface Props {
  initialData?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  isEdit?: boolean;
}

export const ProductForm = ({ initialData, onSubmit, isEdit }: Props) => {
  const { register, control, handleSubmit, watch, setValue } = useForm<Partial<Product>>({
    defaultValues: initialData || {
      name: '',
      category: 'leather_goods',
      subCategory: 'belts',
      shortDescription: '',
      fullDescription: '',
      material: 'Натуральная кожа',
      basePrice: 0,
      isPreOrder: true,
      productionDays: 7,
      images: [],
      variants: [{ color: 'Черный', sku: 'SKU-1', stock: 0, price: 0 }],
      personalizationOptions: [],
      isActive: true,
    },
  });

  const [loading, setLoading] = useState(false);

  // Динамические поля для вариантов (цвет/размер)
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants',
  });

  // Динамические поля для гравировки
  const { fields: personalizationFields, append: appendPersonalization, remove: removePersonalization } = useFieldArray({
    control,
    name: 'personalizationOptions',
  });

  // Отслеживаем картинки для ImageUploader
  const images = watch('images') || [];

  const onFormSubmit = async (data: Partial<Product>) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form}>
      {/* === БЛОК 1. ОСНОВНОЕ === */}
      <section className={styles.section}>
        <h2>Основная информация</h2>
        
        <div className={styles.row}>
          <label className={styles.field}>
            Название *
            <input {...register('name', { required: true })} />
          </label>
          <label className={styles.field}>
            Цена (базовая) *
            <input type="number" {...register('basePrice', { valueAsNumber: true, required: true })} />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            Категория
            <select {...register('category')}>
              <option value="leather_goods">Изделия из кожи</option>
              <option value="packaging">Упаковка</option>
            </select>
          </label>
          <label className={styles.field}>
            Подкатегория
            <select {...register('subCategory')}>
              <option value="belts">Ремни</option>
              <option value="wallets">Кошельки</option>
              <option value="bags">Сумки</option>
              <option value="documents">Для документов</option>
              <option value="gift_sets">Подарочные наборы</option>
              <option value="accessories">Аксессуары</option>
              <option value="gift_boxes">Подарочные упаковки</option>
            </select>
          </label>
        </div>

        <label className={styles.field}>
          Краткое описание (для карточки)
          <input {...register('shortDescription', { required: true })} />
        </label>

        <label className={styles.field}>
          Полное описание
          <textarea rows={4} {...register('fullDescription', { required: true })} />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            Материал
            <input {...register('material')} />
          </label>
          <label className={styles.field}>
            Срок изготовления (дней)
            <input type="number" {...register('productionDays', { valueAsNumber: true })} />
          </label>
        </div>
      </section>

      {/* === БЛОК 2. КАРТИНКИ === */}
      <section className={styles.section}>
        <h2>Галерея</h2>
        <ImageUploader 
          value={images} 
          onChange={(urls) => setValue('images', urls)} 
        />
      </section>

      {/* === БЛОК 3. ВАРИАНТЫ (Цвета и размеры) === */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Варианты (Цвет / Размер)</h2>
          <button 
            type="button" 
            onClick={() => appendVariant({ color: '', sku: '', stock: 0, price: watch('basePrice') || 0 })}
            className={styles.addBtn}
          >
            + Добавить вариант
          </button>
        </div>

        {variantFields.map((field, index) => (
          <div key={field.id} className={styles.dynamicRow}>
            <label>
              Цвет *
              <input {...register(`variants.${index}.color` as const, { required: true })} />
            </label>
            <label>
              Размер (опц.)
              <input {...register(`variants.${index}.size` as const)} />
            </label>
            <label>
              SKU (артикул) *
              <input {...register(`variants.${index}.sku` as const, { required: true })} />
            </label>
            <label>
              Остаток *
              <input type="number" {...register(`variants.${index}.stock` as const, { valueAsNumber: true })} />
            </label>
            <label>
              Цена *
              <input type="number" {...register(`variants.${index}.price` as const, { valueAsNumber: true })} />
            </label>
            <button type="button" onClick={() => removeVariant(index)} className={styles.removeBtn}>
              ×
            </button>
          </div>
        ))}
      </section>

      {/* === БЛОК 4. ПЕРСОНАЛИЗАЦИЯ (Гравировка) === */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Опции персонализации (Гравировка)</h2>
          <button 
            type="button" 
            onClick={() => appendPersonalization({ type: 'text', price: 500, isActive: true })}
            className={styles.addBtn}
          >
            + Добавить опцию
          </button>
        </div>

        {personalizationFields.map((field, index) => (
          <div key={field.id} className={styles.dynamicRow}>
            <label>
              Тип
              <select {...register(`personalizationOptions.${index}.type` as const)}>
                <option value="text">Текст</option>
                <option value="image">Картинка</option>
              </select>
            </label>
            <label>
              Цена (руб.)
              <input type="number" {...register(`personalizationOptions.${index}.price` as const, { valueAsNumber: true })} />
            </label>
            <label>
              Макс. символов
              <input type="number" {...register(`personalizationOptions.${index}.maxLength` as const, { valueAsNumber: true })} />
            </label>
            <button type="button" onClick={() => removePersonalization(index)} className={styles.removeBtn}>
              ×
            </button>
          </div>
        ))}
      </section>

      {/* === БЛОК 5. СТАТУСЫ === */}
      <section className={styles.section}>
        <h2>Статусы</h2>
        <div className={styles.row}>
          <label className={styles.checkbox}>
            <input type="checkbox" {...register('isActive')} />
            Активен (показывать в каталоге)
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" {...register('isPreOrder')} />
            Доступен по предзаказу
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" {...register('isTopSelling')} />
            ТОП продаж (на главной)
          </label>
        </div>
      </section>

      <div className={styles.footer}>
        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Сохранение…' : isEdit ? 'Сохранить изменения' : 'Создать товар'}
        </button>
      </div>
    </form>
  );
};