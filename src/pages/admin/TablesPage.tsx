import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Users, Circle, Square } from "lucide-react";
import { useTableStore, type CafeTable, type TableShape, type TableStatus } from "@/stores/tableStore";
import { useOrderStore } from "@/stores/orderStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const statusColors: Record<TableStatus, string> = {
  available: "border-green-500 bg-green-50 dark:bg-green-900/20",
  occupied: "border-red-500 bg-red-50 dark:bg-red-900/20",
  reserved: "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
};

const statusDot: Record<TableStatus, string> = {
  available: "bg-green-500",
  occupied: "bg-red-500",
  reserved: "bg-yellow-500",
};

const TablesPage = () => {
  const { tables, addTable, updateTable, deleteTable, setStatus } = useTableStore();
  const orders = useOrderStore((s) => s.orders);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingTable, setEditingTable] = useState<CafeTable | null>(null);
  const [form, setForm] = useState({ name: "", capacity: 4, shape: "square" as TableShape, status: "available" as TableStatus });

  const openAdd = () => {
    setEditingTable(null);
    const nextNum = tables.length + 1;
    setForm({ name: `T${nextNum}`, capacity: 4, shape: "square", status: "available" });
    setModalOpen(true);
  };

  const openEdit = (t: CafeTable) => {
    setEditingTable(t);
    setForm({ name: t.name, capacity: t.capacity, shape: t.shape, status: t.status });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Table name is required"); return; }
    if (editingTable) {
      updateTable(editingTable.id, form);
      toast.success("Table updated");
    } else {
      addTable(form);
      toast.success("Table added");
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) { deleteTable(deleteId); toast.success("Table deleted"); setDeleteId(null); }
  };

  const getTableOrder = (t: CafeTable) => {
    if (t.currentOrderId) return orders.find((o) => o.id === t.currentOrderId);
    return undefined;
  };

  const availableCount = tables.filter((t) => t.status === "available").length;
  const occupiedCount = tables.filter((t) => t.status === "occupied").length;
  const reservedCount = tables.filter((t) => t.status === "reserved").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Table Management</h1>
        <Button onClick={openAdd} className="gap-1.5"><Plus className="h-4 w-4" /> Add Table</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Available", count: availableCount, color: "text-green-600 dark:text-green-400" },
          { label: "Occupied", count: occupiedCount, color: "text-red-600 dark:text-red-400" },
          { label: "Reserved", count: reservedCount, color: "text-yellow-600 dark:text-yellow-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence>
          {tables.map((table, i) => {
            const order = getTableOrder(table);
            return (
              <motion.div
                key={table.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03 }}
                className={`relative rounded-xl border-2 p-5 transition-all ${statusColors[table.status]}`}
              >
                {/* Status dot */}
                <div className={`absolute right-3 top-3 h-3 w-3 rounded-full ${statusDot[table.status]}`} />

                <div className="mb-3 flex items-center gap-2">
                  {table.shape === "round" ? <Circle className="h-5 w-5 text-muted-foreground" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                  <h3 className="text-lg font-bold">{table.name}</h3>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" /> {table.capacity} seats
                </div>

                <p className="mt-1 text-xs font-medium capitalize text-muted-foreground">{table.status}</p>

                {order && (
                  <div className="mt-2 rounded-lg bg-background/50 p-2 text-xs">
                    <p className="font-medium">{order.id}</p>
                    <p className="text-muted-foreground">{order.customerName} • ${order.total.toFixed(2)}</p>
                  </div>
                )}

                <div className="mt-3 flex gap-1">
                  <Select value={table.status} onValueChange={(v) => setStatus(table.id, v as TableStatus)}>
                    <SelectTrigger className="h-7 text-xs flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(table)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setDeleteId(table.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTable ? "Edit Table" : "Add Table"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Table Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="T1" />
            </div>
            <div>
              <Label>Capacity</Label>
              <Select value={form.capacity.toString()} onValueChange={(v) => setForm({ ...form, capacity: parseInt(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[2, 4, 6, 8].map((n) => (
                    <SelectItem key={n} value={n.toString()}>{n} seats</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Shape</Label>
              <Select value={form.shape} onValueChange={(v) => setForm({ ...form, shape: v as TableShape })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="round">Round</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingTable ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Table?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the table from the layout.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default TablesPage;
