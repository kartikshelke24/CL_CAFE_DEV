import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TableShape = "square" | "round";
export type TableStatus = "available" | "occupied" | "reserved";

export interface CafeTable {
  id: string;
  name: string;
  capacity: number;
  shape: TableShape;
  status: TableStatus;
  currentOrderId?: string;
}

const defaultTables: CafeTable[] = [
  { id: "table_1", name: "T1", capacity: 2, shape: "square", status: "available" },
  { id: "table_2", name: "T2", capacity: 4, shape: "round", status: "available" },
  { id: "table_3", name: "T3", capacity: 4, shape: "square", status: "occupied" },
  { id: "table_4", name: "T4", capacity: 6, shape: "round", status: "available" },
  { id: "table_5", name: "T5", capacity: 2, shape: "square", status: "reserved" },
  { id: "table_6", name: "T6", capacity: 8, shape: "round", status: "available" },
  { id: "table_7", name: "T7", capacity: 4, shape: "square", status: "available" },
  { id: "table_8", name: "T8", capacity: 2, shape: "round", status: "occupied" },
];

interface TableState {
  tables: CafeTable[];
  addTable: (table: Omit<CafeTable, "id">) => void;
  updateTable: (id: string, updates: Partial<CafeTable>) => void;
  deleteTable: (id: string) => void;
  setStatus: (id: string, status: TableStatus, orderId?: string) => void;
  getAvailableTables: () => CafeTable[];
}

export const useTableStore = create<TableState>()(
  persist(
    (set, get) => ({
      tables: defaultTables,
      addTable: (table) => {
        const id = `table_${Date.now().toString(36)}`;
        set((s) => ({ tables: [...s.tables, { ...table, id }] }));
      },
      updateTable: (id, updates) =>
        set((s) => ({
          tables: s.tables.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTable: (id) =>
        set((s) => ({ tables: s.tables.filter((t) => t.id !== id) })),
      setStatus: (id, status, orderId) =>
        set((s) => ({
          tables: s.tables.map((t) =>
            t.id === id ? { ...t, status, currentOrderId: orderId } : t
          ),
        })),
      getAvailableTables: () => get().tables.filter((t) => t.status === "available"),
    }),
    { name: "brew-haven-tables" }
  )
);
