import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { Product } from '@/types';
import { ImageUploader } from './components/ImageUploader';
import styles from './ProductForm.module.css';
import { getSavedColors, saveCustomColor } from '@/shared/utils/colors';

interface Props {
  initialData?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  isEdit?: boolean;
}

export const ProductForm = ({ initialData, onSubmit, isEdit }: Props) => {
  // Храним доступные цвета в состоянии, чтобы они обновлялись при добавлении нового
  const [availableColors, setAvailableColors] = useState(getSavedColors());

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
      variants: [{ colorName: 'Черный', colorHex: '#111111', sku: 'SKU-1', stock: 0, price: 0 }],
      personalizationOptions: [],
      isActive: true,
    },
  });

  const [loading, setLoading] = useState(false);

  // Динамические поля
  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants',
  });

  const { fields: personalizationFields, append: appendPersonalization, remove: removePersonalization } = useFieldArray({
    control,
    name: 'personalizationOptions',
  });

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
            onClick={() => appendVariant({ colorName: 'Черный', colorHex: '#111111', sku: '', stock: 0, price: watch('basePrice') || 0 })}
            className={styles.addBtn}
          >
            + Добавить вариант
          </button>
        </div>

        <div className={styles.variantsList}>
          {variantFields.map((field, index) => {
            const currentColorName = watch(`variants.${index}.colorName`);
            const currentColorHex = watch(`variants.${index}.colorHex`);

            return (
              <div key={field.id} className={styles.variantRow}>
                <label className={styles.variantField}>
                  Цвет *
                  <div className={styles.colorPalette}>
                    {availableColors.map((c) => {
                      const isSelected = currentColorName === c.name;
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          title={c.name}
                          className={`${styles.colorSwatch} ${isSelected ? styles.colorSwatchActive : ''}`}
                          style={{ backgroundColor: c.hex }}
                          onClick={() => {
                            setValue(`variants.${index}.colorName`, c.name, { shouldValidate: true });
                            setValue(`variants.${index}.colorHex`, c.hex);
                          }}
                        />
                      );
                    })}

                    {/* Кнопка добавления своего цвета */}
                    <div className={styles.customColorWrap} title="Добавить свой цвет">
                      <input
                        type="color"
                        className={styles.colorPickerInput}
                        value={currentColorHex || '#cccccc'}
                        onChange={(e) => {
                          const hex = e.target.value;
                          const name = window.prompt('Введите название для этого цвета (например: Горчичный):');
                          
                          if (name && name.trim()) {
                            saveCustomColor(name.trim(), hex);
                            setAvailableColors(getSavedColors()); // Обновляем палитру
                            
                            setValue(`variants.${index}.colorHex`, hex);
                            setValue(`variants.${index}.colorName`, name.trim());
                          }
                        }}
                      />
                      <span className={styles.colorPickerIcon}>+</span>
                    </div>
                  </div>

                  {/* Индикатор выбранного цвета */}
                  <div className={styles.selectedColorText}>
                    <span 
                      className={styles.colorDot} 
                      style={{ backgroundColor: currentColorHex || '#ccc' }} 
                    />
                    {currentColorName || 'не выбран'}
                  </div>

                  {/* Скрытые инпуты для сохранения */}
                  <input type="hidden" {...register(`variants.${index}.colorName` as const, { required: true })} />
                  <input type="hidden" {...register(`variants.${index}.colorHex` as const)} />
                </label>

                <label className={styles.variantField}>
                  Размер (опц.)
                  <input placeholder="Например: 95 см" {...register(`variants.${index}.size` as const)} />
                </label>

                <label className={styles.variantField}>
                  SKU (артикул) *
                  <input placeholder="BELT-BLK-95" {...register(`variants.${index}.sku` as const, { required: true })} />
                </label>

                <label className={styles.variantField}>
                  Остаток *
                  <input type="number" {...register(`variants.${index}.stock` as const, { valueAsNumber: true })} />
                </label>

                <label className={styles.variantField}>
                  Цена *
                  <input type="number" {...register(`variants.${index}.price` as const, { valueAsNumber: true })} />
                </label>

                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className={styles.removeBtn}
                  title="Удалить вариант"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
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