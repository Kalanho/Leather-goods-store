import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantSku: string) => void;
  updateQuantity: (variantSku: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items;
        const existing = items.find(
          (i) =>
            i.variantSku === newItem.variantSku &&
            JSON.stringify(i.personalization) ===
              JSON.stringify(newItem.personalization) &&
            i.giftBox === newItem.giftBox
        );

        if (existing) {
          set({
            items: items.map((i) =>
              i === existing
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (variantSku) =>
        set({ items: get().items.filter((i) => i.variantSku !== variantSku) }),

      updateQuantity: (variantSku, quantity) =>
        set({
          items: get().items.map((i) =>
            i.variantSku === variantSku ? { ...i, quantity } : i
          ),
        }),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce((sum, item) => {
          let itemTotal = item.price * item.quantity;
          if (item.personalization) itemTotal += item.personalization.price;
          if (item.giftBox && item.giftBoxPrice) itemTotal += item.giftBoxPrice;
          return sum + itemTotal;
        }, 0),

      getCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'manticore-cart', // ключ в localStorage
    }
  )
);