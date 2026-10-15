import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, type ProductsFilter } from '@/api/products';

export const useProducts = () => {
  const [searchParams] = useSearchParams();

  const filter: ProductsFilter = {
    category: searchParams.get('category') || undefined,
    subCategory: searchParams.get('subCategory') || undefined,
    color: searchParams.get('color') || undefined,
    material: searchParams.get('material') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    isPreOrder: searchParams.get('isPreOrder') === 'true' ? true : undefined,
    isTopSelling: searchParams.get('isTopSelling') === 'true' ? true : undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || '-createdAt',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
  };

  return useQuery({
    queryKey: ['products', filter],
    queryFn: () => fetchProducts(filter),
    placeholderData: keepPreviousData, // не мигать при смене страницы
  });
};