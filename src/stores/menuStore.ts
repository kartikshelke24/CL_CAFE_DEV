import { create } from "zustand";
import { persist } from "zustand/middleware";
import { menuItems as defaultItems, type MenuItem } from "@/data/menu";

export type ItemTag = "bestseller" | "new" | "recommended";

export interface ManagedMenuItem extends MenuItem {
  categoryId: string;
  type: "veg" | "non-veg" | "vegan";
  discountPrice?: number;
  isAvailable: boolean;
  tags: ItemTag[];
}

function toManaged(item: MenuItem): ManagedMenuItem {
  const catMap: Record<string, string> = {
    coffee: "cat_1", tea: "cat_2", pastry: "cat_3",
    smoothie: "cat_4", sandwich: "cat_5", dessert: "cat_6",
  };
  return {
    ...item,
    categoryId: catMap[item.category] || "cat_1",
    type: ["sandwich"].includes(item.category) ? "non-veg" : "veg",
    isAvailable: true,
    tags: item.popular ? ["bestseller"] : [],
  };
}

interface MenuState {
  items: ManagedMenuItem[];
  addItem: (item: Omit<ManagedMenuItem, "id">) => void;
  updateItem: (id: string, updates: Partial<ManagedMenuItem>) => void;
  deleteItem: (id: string) => void;
  toggleAvailability: (id: string) => void;
}

export const useMenuStore = create<MenuState>()(
  persist(
    (set) => ({
      items: defaultItems.map(toManaged),
      addItem: (item) => {
        const id = `item_${Date.now().toString(36)}`;
        set((s) => ({ items: [...s.items, { ...item, id } as ManagedMenuItem] }));
      },
      updateItem: (id, updates) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
      deleteItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      toggleAvailability: (id) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, isAvailable: !i.isAvailable } : i
          ),
        })),
    }),
    { name: "brew-haven-menu-managed" }
  )
);
