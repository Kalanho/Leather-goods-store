export type MainCategory = 'leather_goods' | 'packaging';

export type SubCategory =
  | 'documents'
  | 'wallets'
  | 'belts'
  | 'bags'
  | 'gift_sets'
  | 'accessories'
  | 'gift_boxes'
  | 'none';

export interface Variant {
  color: string;
  size?: string;
  sku: string;
  stock: number;
  price: number;
  image?: string;
}

export interface PersonalizationOption {
  type: 'text' | 'image';
  price: number;
  maxLength?: number;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: MainCategory;
  subCategory: SubCategory;
  shortDescription: string;
  fullDescription: string;
  material: string;
  careInstructions?: string;
  basePrice: number;
  discountPrice?: number;
  isPreOrder: boolean;
  productionDays?: number;
  images: string[];
  mobileImages?: string[];
  variants: Variant[];
  personalizationOptions: PersonalizationOption[];
  giftBoxAvailable: boolean;
  giftBoxProductId?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  isActive: boolean;
  isTopSelling: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  variantSku: string;
  color: string;
  size?: string;
  price: number;
  quantity: number;
  personalization?: {
    type: 'text' | 'image';
    value: string;
    price: number;
  };
  giftBox?: boolean;
  giftBoxPrice?: number;
}
export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    postalCode?: string;
    comment?: string;
  };
  items: Array<{
    productId: any;
    variantSku: string;
    color: string;
    quantity: number;
    price: number;
    personalization?: { type: string; value: string; price: number };
    giftBox?: boolean;
  }>;
  total: number;
  payment: { status: string; paidAt?: string };
  delivery: { provider: string; status: string; trackNumber?: string };
  createdAt: string;
}