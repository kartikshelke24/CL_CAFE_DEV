import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./cartStore";

export type OrderStatus = "confirmed" | "preparing" | "ready" | "delivered";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  tableId?: string;
  orderType: "dine-in" | "takeaway";
}

interface OrderState {
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "createdAt" | "status">) => string;
  updateStatus: (id: string, status: OrderStatus) => void;
  getOrder: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      placeOrder: (order) => {
        const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
        const newOrder: Order = { ...order, id, createdAt: new Date().toISOString(), status: "confirmed" };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return id;
      },
      updateStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "brew-haven-orders" }
  )
);
