import { useState, useMemo, useEffect } from 'react';
import type { Product, Variant } from '@/types';

export const useProductSelection = (product: Product | undefined) => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  // Уникальные цвета
  const colors = useMemo(() => {
    if (!product) return [];
    return Array.from(new Set(product.variants.map((v) => v.color)));
  }, [product]);

  // При загрузке товара — выбираем первый цвет
  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0]);
    }
  }, [colors, selectedColor]);

  // Варианты выбранного цвета
  const variantsOfColor: Variant[] = useMemo(() => {
    if (!product || !selectedColor) return [];
    return product.variants.filter((v) => v.color === selectedColor);
  }, [product, selectedColor]);

  // Размеры выбранного цвета
  const sizes = useMemo(() => {
    return Array.from(
      new Set(variantsOfColor.map((v) => v.size).filter(Boolean) as string[])
    );
  }, [variantsOfColor]);

  // При смене цвета сбрасываем размер, если его нет
  useEffect(() => {
    if (sizes.length > 0) {
      if (!selectedSize || !sizes.includes(selectedSize)) {
        setSelectedSize(sizes[0]);
      }
    } else {
      setSelectedSize(undefined);
    }
  }, [sizes, selectedSize]);

  // Итоговый выбранный вариант
  const selectedVariant: Variant | undefined = useMemo(() => {
    if (!variantsOfColor.length) return undefined;
    if (sizes.length === 0) return variantsOfColor[0];
    return variantsOfColor.find((v) => v.size === selectedSize) || variantsOfColor[0];
  }, [variantsOfColor, selectedSize, sizes]);

  // При смене цвета/варианта — обновляем картинку
  useEffect(() => {
    if (!selectedVariant) return;

    // Приоритет: image варианта → первое изображение товара
    const img = selectedVariant.image || product?.images[0];
    setSelectedImage(img);
  }, [selectedVariant, product]);

  return {
    colors,
    selectedColor,
    setSelectedColor,

    sizes,
    selectedSize,
    setSelectedSize,

    selectedVariant,
    selectedImage,
  };
};
