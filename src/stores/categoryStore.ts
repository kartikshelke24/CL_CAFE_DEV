import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

// ==========================
// TYPES
// ==========================
export interface Category {
  id: number;
  name: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;

  // API actions
  loadCategories: () => Promise<void>;
  saveCategory: (form: any, id?: number) => Promise<any>;
  deleteCategory: (id: number) => Promise<any>;
}

// ==========================
// STORE
// ==========================
export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: [],
      loading: false,

      // ==========================
      // 🔹 LOAD CATEGORIES
      // ==========================
      loadCategories: async () => {
        try {
          set({ loading: true });

          const res = await api.get("/Master/DT_MENU_CATEGORY", {
            params: { custSrNo: 1 },
          });
          debugger

          if (res.data.msgId === 1) {
            const mapped = res.data.Data.map((c: any) => ({
              id: c.CATEGORY_SRNO,
              name: c.CATEGORY_NAME,
              icon: c.ICON || "☕",
              displayOrder: c.OBY || 1,
              isActive: c.IS_ACTIVE,
            }));

            set({ categories: mapped });
          } else {
            throw res.data;
          }
        } catch (err) {
          console.error("❌ Load Categories Error:", err);
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // ==========================
      // 🔹 ADD / UPDATE CATEGORY
      // ==========================
      saveCategory: async (form, id) => {
        try {
          const fd = new FormData();

          fd.append("CATEGORY_SRNO", id ? id.toString() : "0");
          fd.append("CUST_SRNO", "1");
          fd.append("CATEGORY_NAME", form.name);
          fd.append("CATEGORY_DESC", form.name);
          fd.append("ICON", form.icon);
          fd.append("OBY", form.displayOrder.toString());
          fd.append("IS_ACTIVE", "true");
          fd.append("USER_SRNO", "1");

          const res = await api.postForm("/Master/IU_MENU_CATEGORY", fd);

          if (res.data.msgId === 1) {
            // reload list after save
            await get().loadCategories();
            return res.data;
          } else {
            throw res.data;
          }
        } catch (err) {
          console.error("❌ Save Category Error:", err);
          throw err;
        }
      },

      // ==========================
      // 🔹 DELETE CATEGORY
      // ==========================
      deleteCategory: async (id) => {
        try {
          const res = await api.delete("/Master/DEL_MENU_CATEGORY", {
            params: {
              categorySrNo: id,
              custSrNo: 1,
              userSrNo: 1,
            },
          });

          if (res.data.msgId === 1) {
            // reload after delete
            await get().loadCategories();
            return res.data;
          } else {
            throw res.data;
          }
        } catch (err) {
          console.error("❌ Delete Category Error:", err);
          throw err;
        }
      },
    }),
    {
      name: "category-store",
      partialize: (state) => ({
        categories: state.categories,
      }),
    }
  )
);





























// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export type DietType = "veg" | "non-veg" | "vegan";

// export interface Category {
//   id: string;
//   name: string;
//   type: DietType;
//   icon: string;
//   displayOrder: number;
//   isActive: boolean;
// }

// const defaultCategories: Category[] = [
//   { id: "cat_1", name: "Coffee", type: "veg", icon: "☕", displayOrder: 1, isActive: true },
//   { id: "cat_2", name: "Tea", type: "veg", icon: "🍵", displayOrder: 2, isActive: true },
//   { id: "cat_3", name: "Pastries", type: "veg", icon: "🥐", displayOrder: 3, isActive: true },
//   { id: "cat_4", name: "Smoothies", type: "veg", icon: "🥤", displayOrder: 4, isActive: true },
//   { id: "cat_5", name: "Sandwiches", type: "non-veg", icon: "🥪", displayOrder: 5, isActive: true },
//   { id: "cat_6", name: "Desserts", type: "veg", icon: "🍰", displayOrder: 6, isActive: true },
// ];

// interface CategoryState {
//   categories: Category[];
//   addCategory: (cat: Omit<Category, "id">) => void;
//   updateCategory: (id: string, updates: Partial<Category>) => void;
//   deleteCategory: (id: string) => void;
//   toggleActive: (id: string) => void;
//   getActiveCategories: () => Category[];
// }

// export const useCategoryStore = create<CategoryState>()(
//   persist(
//     (set, get) => ({
//       categories: defaultCategories,
//       addCategory: (cat) => {
//         const id = `cat_${Date.now().toString(36)}`;
//         set((s) => ({ categories: [...s.categories, { ...cat, id }] }));
//       },
//       updateCategory: (id, updates) =>
//         set((s) => ({
//           categories: s.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
//         })),
//       deleteCategory: (id) =>
//         set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
//       toggleActive: (id) =>
//         set((s) => ({
//           categories: s.categories.map((c) =>
//             c.id === id ? { ...c, isActive: !c.isActive } : c
//           ),
//         })),
//       getActiveCategories: () =>
//         get()
//           .categories.filter((c) => c.isActive)
//           .sort((a, b) => a.displayOrder - b.displayOrder),
//     }),
//     { name: "brew-haven-categories" }
//   )
// );
