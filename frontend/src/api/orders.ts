import { api } from './client';

export interface CreateOrderPayload {
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    postalCode?: string;
    comment?: string;
  };
  items: Array<{
    productId: string;
    variantSku: string;
    quantity: number;
    personalization?: { type: 'text' | 'image'; value: string };
    giftBox?: boolean;
  }>;
  delivery: {
    provider: 'cdek' | 'pickup' | 'other';
    method: string;
  };
  payment: {
    provider: 'yookassa' | 'cloudpayments' | 'other';
  };
  deliveryPrice?: number;
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const { data } = await api.post('/orders', payload);
  return data.data;
};

export const fetchOrderByNumber = async (orderNumber: string) => {
  const { data } = await api.get(`/orders/${orderNumber}`);
  return data.data;
};