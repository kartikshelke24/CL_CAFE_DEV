import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CartPage = () => {
  const { subdomain } = useParams();
  const { items, removeItem, updateQuantity, applyCoupon, removeCoupon, couponCode, getSubtotal, getTax, getDiscount, getTotal } = useCartStore();
  const [couponInput, setCouponInput] = useState("");

  const handleCoupon = () => {
    const result = applyCoupon(couponInput);
    toast[result.success ? "success" : "error"](result.message);
    if (result.success) setCouponInput("");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <h2 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">Add some delicious items to get started</p>
          <Link to={`/v/${subdomain}/menu`}><Button className="mt-6">Browse Menu</Button></Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl font-bold">
        Your Cart ({items.length})
      </motion.h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-semibold">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {item.customization.size}
                        {item.customization.addOns.length > 0 && ` • ${item.customization.addOns.join(", ")}`}
                      </p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-lg border border-border">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-muted-foreground hover:text-foreground">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-muted-foreground hover:text-foreground">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-semibold">${(item.totalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold">Order Summary</h3>

            {/* Coupon */}
            <div className="mt-4">
              {couponCode ? (
                <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
                  <span className="flex items-center gap-1 text-sm font-medium text-primary">
                    <Tag className="h-3.5 w-3.5" /> {couponCode}
                  </span>
                  <button onClick={removeCoupon}><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input placeholder="Coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="text-sm" />
                  <Button variant="outline" size="sm" onClick={handleCoupon}>Apply</Button>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${getSubtotal().toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>${getTax().toFixed(2)}</span></div>
              {getDiscount() > 0 && (
                <div className="flex justify-between text-primary"><span>Discount</span><span>-${getDiscount().toFixed(2)}</span></div>
              )}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span><span>${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link to={`/v/${subdomain}/checkout`}>
              <Button className="mt-6 w-full gap-2" size="lg">
                Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
