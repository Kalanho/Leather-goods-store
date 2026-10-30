import { api } from './client';

export interface AdminOrder {
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
    size?: string;
    quantity: number;
    price: number;
    personalization?: { value: string; price: number };
    giftBox?: boolean;
  }>;
  total: number;
  payment: { status: 'pending' | 'paid' | 'failed' };
  delivery: { provider: string; status: string; trackNumber?: string };
  createdAt: string;
  isArchived?: boolean; // <-- ДОБАВЛЕНО
}

export const fetchAdminOrders = async (archived = false): Promise<AdminOrder[]> => {
  const { data } = await api.get(`/orders?archived=${archived}`);
  return data.data;
};

export const deleteOrderApi = async (id: string) => {
  await api.delete(`/orders/${id}`);
};

// Обновили payload, чтобы принимал isArchived
export const updateOrderStatusApi = async (
  id: string,
  payload: { 
    paymentStatus?: string; 
    deliveryStatus?: string; 
    trackNumber?: string; 
    isArchived?: boolean; // <-- ДОБАВЛЕНО
  }
) => {
  const { data } = await api.patch(`/orders/${id}/status`, payload);
  return data.data;
};