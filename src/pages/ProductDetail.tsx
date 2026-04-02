import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Heart, Minus, Plus, ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { menuItems } from "@/data/menu";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { Button } from "@/components/ui/button";
import MenuCard from "@/components/menu/MenuCard";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const item = menuItems.find((i) => i.id === id);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();

  const [size, setSize] = useState("Medium");
  const [addOns, setAddOns] = useState<string[]>([]);
  const [sugarLevel, setSugarLevel] = useState("Normal");
  const [iceLevel, setIceLevel] = useState("Normal");
  const [qty, setQty] = useState(1);

  if (!item) return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold">Item not found</h2>
        <Link to="/menu"><Button className="mt-4">Back to Menu</Button></Link>
      </div>
    </div>
  );

  const sizeAdd = item.customizations.sizes.find((s) => s.name === size)?.priceAdd || 0;
  const addOnTotal = item.customizations.addOns
    .filter((a) => addOns.includes(a.name))
    .reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.price + sizeAdd + addOnTotal;
  const totalPrice = unitPrice * qty;

  const related = menuItems.filter((i) => i.category === item.category && i.id !== item.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      basePrice: item.price,
      quantity: qty,
      customization: { size, addOns, sugarLevel, iceLevel },
      totalPrice: unitPrice,
    });
    toast.success(`${item.name} added to cart!`);
  };

  const toggleAddOn = (name: string) =>
    setAddOns((prev) => prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/menu" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Menu
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="overflow-hidden rounded-2xl">
          <img src={item.image} alt={item.name} className="aspect-square w-full object-cover" />
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              {item.popular && (
                <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  Popular
                </span>
              )}
              <h1 className="font-display text-3xl font-bold md:text-4xl">{item.name}</h1>
            </div>
            <button onClick={() => toggle(item.id)} className="rounded-full border border-border p-2.5 transition-colors hover:bg-secondary">
              <Heart className={`h-5 w-5 ${has(item.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-cafe-amber text-cafe-amber" />
              <span className="font-medium">{item.rating}</span>
            </div>
            <span className="text-muted-foreground">({item.reviews} reviews)</span>
          </div>

          <p className="mt-4 text-muted-foreground">{item.description}</p>

          <div className="mt-6 space-y-6">
            {/* Size */}
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Size</h3>
              <div className="flex flex-wrap gap-2">
                {item.customizations.sizes.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSize(s.name)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      size === s.name
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {s.name} {s.priceAdd > 0 && `+$${s.priceAdd.toFixed(2)}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            {item.customizations.addOns.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Add-ons</h3>
                <div className="flex flex-wrap gap-2">
                  {item.customizations.addOns.map((a) => (
                    <button
                      key={a.name}
                      onClick={() => toggleAddOn(a.name)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-all ${
                        addOns.includes(a.name)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {addOns.includes(a.name) && <Check className="h-3 w-3" />}
                      {a.name} +${a.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sugar & Ice */}
            {item.customizations.sugarLevels.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sugar Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.customizations.sugarLevels.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSugarLevel(s)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                          sugarLevel === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Ice Level</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.customizations.iceLevels.map((l) => (
                      <button
                        key={l}
                        onClick={() => setIceLevel(l)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                          iceLevel === l ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price & Add to Cart */}
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-6">
            <div className="flex items-center gap-3 rounded-lg border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground">
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2rem] text-center font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <Button size="lg" className="w-full gap-2" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart — ${totalPrice.toFixed(2)}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">You May Also Like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
