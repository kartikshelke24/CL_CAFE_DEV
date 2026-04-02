import { create } from "zustand";
import { persist } from "zustand/middleware";
import { coupons } from "@/data/menu";

export interface CartItemCustomization {
  size: string;
  addOns: string[];
  sugarLevel: string;
  iceLevel: string;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  image: string;
  basePrice: number;
  quantity: number;
  customization: CartItemCustomization;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getDiscount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,
      addItem: (item) => {
        const id = crypto.randomUUID();
        set((state) => ({ items: [...state.items, { ...item, id }] }));
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((i) => i.id !== id)
            : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      applyCoupon: (code) => {
        const coupon = coupons[code.toUpperCase()];
        if (!coupon) return { success: false, message: "Invalid coupon code" };
        const subtotal = get().getSubtotal();
        if (subtotal < coupon.minOrder)
          return { success: false, message: `Minimum order $${coupon.minOrder} required` };
        const discount =
          coupon.type === "percent" ? (subtotal * coupon.discount) / 100 : coupon.discount;
        set({ couponCode: code.toUpperCase(), couponDiscount: discount });
        return { success: true, message: `${coupon.discount}${coupon.type === "percent" ? "%" : "$"} off applied!` };
      },
      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),
      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.totalPrice * i.quantity, 0),
      getTax: () => get().getSubtotal() * 0.08,
      getDiscount: () => get().couponDiscount,
      getTotal: () => get().getSubtotal() + get().getTax() - get().getDiscount(),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "brew-haven-cart" }
  )
);
