import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, Truck, ArrowLeft, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useOrderStore, type OrderStatus } from "@/stores/orderStore";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statusConfig: Record<OrderStatus, { icon: typeof Package; label: string; color: string }> = {
  confirmed: { icon: Package, label: "Order Confirmed", color: "text-blue-500" },
  preparing: { icon: Clock, label: "Preparing", color: "text-cafe-amber" },
  ready: { icon: CheckCircle2, label: "Ready for Pickup", color: "text-cafe-sage" },
  delivered: { icon: Truck, label: "Delivered", color: "text-primary" },
};

const statusOrder: OrderStatus[] = ["confirmed", "preparing", "ready", "delivered"];

const OrdersPage = () => {
  const { id } = useParams();
  const { orders, updateStatus, getOrder } = useOrderStore();
  const addItem = useCartStore((s) => s.addItem);

  // Auto-progress simulation for individual order view
  const order = id ? getOrder(id) : null;
  const [simStatus, setSimStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    if (!order || order.status === "delivered") return;
    const currentIdx = statusOrder.indexOf(order.status);
    const timer = setTimeout(() => {
      const next = statusOrder[currentIdx + 1];
      if (next) {
        updateStatus(order.id, next);
        setSimStatus(next);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [order, simStatus]);

  // Single order view
  if (id && order) {
    const currentIdx = statusOrder.indexOf(order.status);
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Link to="/orders" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All Orders
        </Link>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="font-display text-2xl font-bold">Order {order.id}</h1>
          <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>

          {/* Timeline */}
          <div className="mt-8 space-y-4">
            {statusOrder.map((s, i) => {
              const config = statusConfig[s];
              const Icon = config.icon;
              const active = i <= currentIdx;
              return (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-4"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>{config.label}</p>
                  </div>
                  {active && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </motion.div>
              );
            })}
          </div>

          {/* Items */}
          <div className="mt-8 rounded-xl border border-border bg-card p-4">
            <h3 className="font-display font-semibold">Items</h3>
            <div className="mt-3 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.totalPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span>Total</span><span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button
            className="mt-6 gap-2"
            variant="outline"
            onClick={() => {
              order.items.forEach((item) => {
                const { id: _id, ...rest } = item;
                addItem(rest);
              });
              toast.success("Items added to cart!");
            }}
          >
            <RotateCw className="h-4 w-4" /> Reorder
          </Button>
        </motion.div>
      </div>
    );
  }

  // Orders list
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="mt-16 text-center">
          <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
          <p className="mt-4 font-medium">No orders yet</p>
          <Link to="/menu"><Button className="mt-4">Browse Menu</Button></Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order, i) => {
            const config = statusConfig[order.status];
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/orders/${order.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:shadow-medium"
                >
                  <div>
                    <p className="font-display font-semibold">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} items • ${order.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`rounded-full bg-secondary px-3 py-1 text-xs font-medium ${config.color}`}>
                    {config.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
