import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, Package, ChefHat, Filter } from "lucide-react";
import { useOrderStore, type OrderStatus } from "@/stores/orderStore";
import { useTableStore } from "@/stores/tableStore";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const statusFlow: OrderStatus[] = ["confirmed", "preparing", "ready", "delivered"];

const StaffPanel = () => {
  const { orders, updateStatus } = useOrderStore();
  const { tables } = useTableStore();
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [tableFilter, setTableFilter] = useState("all");

  const activeOrders = orders.filter((o) => {
    if (o.status === "delivered") return false;
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (tableFilter !== "all" && o.tableId !== tableFilter) return false;
    return true;
  });

  const nextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = statusFlow.indexOf(current);
    return idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  };

  const handleAdvance = (id: string, current: OrderStatus) => {
    const next = nextStatus(current);
    if (next) {
      updateStatus(id, next);
      toast.success(`Order updated to ${next}`);
    }
  };

  const statusIcon = (s: OrderStatus) => {
    switch (s) {
      case "confirmed": return Package;
      case "preparing": return ChefHat;
      case "ready": return CheckCircle2;
      case "delivered": return CheckCircle2;
    }
  };

  const isUrgent = (createdAt: string) => {
    return Date.now() - new Date(createdAt).getTime() > 10 * 60 * 1000; // >10 min
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Staff Panel</h1>
          <p className="text-muted-foreground">Manage incoming orders</p>
        </div>
        <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          {activeOrders.length} active
        </span>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="preparing">Preparing</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tableFilter} onValueChange={setTableFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Table" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tables</SelectItem>
            {tables.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {activeOrders.length === 0 ? (
        <div className="mt-16 text-center">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 font-medium">No active orders</p>
          <p className="text-sm text-muted-foreground">New orders will appear here</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeOrders.map((order, i) => {
            const Icon = statusIcon(order.status);
            const next = nextStatus(order.status);
            const urgent = isUrgent(order.createdAt);
            const tableName = order.tableId ? tables.find((t) => t.id === order.tableId)?.name : null;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border bg-card p-5 ${urgent ? "border-destructive/50 shadow-md" : "border-border"}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-bold">{order.id}</h3>
                    {urgent && <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">URGENT</span>}
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium capitalize">
                    <Icon className="h-3 w-3" /> {order.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{order.customerName}</span>
                  {tableName && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">{tableName}</span>
                  )}
                  {order.orderType && (
                    <span className="text-xs capitalize">• {order.orderType}</span>
                  )}
                </div>
                <div className="mt-3 space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="text-muted-foreground">${(item.totalPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                  {next && (
                    <Button size="sm" onClick={() => handleAdvance(order.id, order.status)} className="capitalize">
                      Mark {next}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StaffPanel;
