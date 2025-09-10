import { create } from 'zustand';

type CartItem = { product_id: number; title: string; price: number; qty: number };
type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (product_id: number) => void;
  clear: () => void;
  total: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (item) => {
    const items = get().items.slice();
    const i = items.findIndex(x => x.product_id === item.product_id);
    if (i >= 0) {
      items[i] = { ...items[i], qty: items[i].qty + item.qty };
    } else {
      items.push(item);
    }
    set({ items });
  },
  remove: (product_id) => set({ items: get().items.filter(x => x.product_id !== product_id) }),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((acc, it) => acc + (it.price * it.qty), 0),
}));
