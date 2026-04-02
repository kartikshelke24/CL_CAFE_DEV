import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Banknote, Smartphone, ArrowLeft, ArrowRight, PartyPopper } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import { useAuthStore } from "@/stores/authStore";
import { useTableStore } from "@/stores/tableStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const steps = ["Details", "Payment", "Review"];

const CheckoutPage = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("card");
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway">("takeaway");
  const [selectedTable, setSelectedTable] = useState("");
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);

  const cart = useCartStore();
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const user = useAuthStore((s) => s.user);
  const { tables, setStatus: setTableStatus } = useTableStore();
  const navigate = useNavigate();

  const availableTables = tables.filter((t) => t.status === "available");

  const handlePlace = () => {
    const orderId = placeOrder({
      items: cart.items,
      subtotal: cart.getSubtotal(),
      tax: cart.getTax(),
      discount: cart.getDiscount(),
      total: cart.getTotal(),
      customerName: name || user?.name || "Guest",
      customerEmail: email || user?.email || "",
      paymentMethod: payment,
      orderType,
      tableId: orderType === "dine-in" ? selectedTable || undefined : undefined,
    });
    // Mark table as occupied
    if (orderType === "dine-in" && selectedTable) {
      setTableStatus(selectedTable, "occupied", orderId);
    }
    cart.clearCart();
    setOrderPlaced(orderId);
    toast.success("Order placed successfully!");
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md text-center">
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
          >
            <PartyPopper className="h-10 w-10 text-primary" />
          </motion.div>
          <h2 className="font-display text-3xl font-bold">Order Confirmed!</h2>
          <p className="mt-2 text-muted-foreground">Your order <strong>{orderPlaced}</strong> has been placed.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => navigate(`/orders/${orderPlaced}`)}>Track Order</Button>
            <Button variant="outline" onClick={() => navigate("/menu")}>Continue Shopping</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Steps */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`hidden text-sm font-medium sm:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`h-px w-8 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Your Details</h2>
            <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />

            {/* Order Type */}
            <div>
              <Label className="mb-2 block">Order Type</Label>
              <div className="flex gap-3">
                {(["dine-in", "takeaway"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => { setOrderType(type); if (type === "takeaway") setSelectedTable(""); }}
                    className={`flex-1 rounded-xl border p-3 text-center text-sm font-medium capitalize transition-all ${
                      orderType === type ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {type === "dine-in" ? "🍽️ Dine In" : "🥡 Takeaway"}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Selection */}
            {orderType === "dine-in" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Label className="mb-2 block">Select Table</Label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                  <SelectTrigger><SelectValue placeholder="Choose a table" /></SelectTrigger>
                  <SelectContent>
                    {availableTables.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name} — {t.capacity} seats ({t.shape})</SelectItem>
                    ))}
                    {availableTables.length === 0 && (
                      <SelectItem value="" disabled>No tables available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </motion.div>
            )}

            <Button className="w-full gap-2" onClick={() => { if (!name || !email) { toast.error("Please fill in name and email"); return; } setStep(1); }}>
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <h2 className="font-display text-2xl font-bold">Payment Method</h2>
            {[
              { id: "card", icon: CreditCard, label: "Credit / Debit Card" },
              { id: "upi", icon: Smartphone, label: "UPI" },
              { id: "cod", icon: Banknote, label: "Cash on Delivery" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setPayment(m.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 transition-all ${
                  payment === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <m.icon className={`h-5 w-5 ${payment === m.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className="font-medium">{m.label}</span>
                {payment === m.id && <Check className="ml-auto h-4 w-4 text-primary" />}
              </button>
            ))}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="gap-1"><ArrowLeft className="h-4 w-4" /> Back</Button>
              <Button className="flex-1 gap-2" onClick={() => setStep(2)}>Review Order <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h2 className="font-display text-2xl font-bold">Review Order</h2>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-medium">${(item.totalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${cart.getSubtotal().toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>${cart.getTax().toFixed(2)}</span></div>
                {cart.getDiscount() > 0 && <div className="flex justify-between text-primary"><span>Discount</span><span>-${cart.getDiscount().toFixed(2)}</span></div>}
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span>${cart.getTotal().toFixed(2)}</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4 text-sm space-y-1">
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Payment:</strong> {payment === "card" ? "Credit/Debit Card" : payment === "upi" ? "UPI" : "Cash on Delivery"}</p>
              <p><strong>Type:</strong> {orderType === "dine-in" ? `Dine-in${selectedTable ? ` (${tables.find((t) => t.id === selectedTable)?.name})` : ""}` : "Takeaway"}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-1"><ArrowLeft className="h-4 w-4" /> Back</Button>
              <Button className="flex-1" size="lg" onClick={handlePlace}>Place Order</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;
