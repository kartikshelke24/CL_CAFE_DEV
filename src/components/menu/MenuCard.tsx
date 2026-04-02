import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Star, Plus } from "lucide-react";
import type { MenuItem } from "@/data/menu";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  item: MenuItem;
  index?: number;
  view?: "grid" | "list";
}

const MenuCard = ({ item, index = 0, view = "grid" }: Props) => {
  const { toggle, has } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const isFav = has(item.id);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      menuItemId: item.id,
      name: item.name,
      image: item.image,
      basePrice: item.price,
      quantity: 1,
      customization: { size: "Medium", addOns: [], sugarLevel: "Normal", iceLevel: "Normal" },
      totalPrice: item.price + 0.5,
    });
    toast.success(`${item.name} added to cart`);
  };

  if (view === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Link to={`/menu/${item.id}`} className="flex gap-4 rounded-xl border border-border bg-card p-3 transition-all hover:shadow-medium">
          <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" loading="lazy" />
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">{item.name}</h3>
                <span className="font-semibold text-primary">${item.price.toFixed(2)}</span>
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{item.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-3.5 w-3.5 fill-cafe-amber text-cafe-amber" />
                <span className="font-medium">{item.rating}</span>
                <span className="text-muted-foreground">({item.reviews})</span>
              </div>
              <Button size="sm" onClick={quickAdd}>Add</Button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/menu/${item.id}`} className="block overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-medium">
        <div className="relative overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(item.id); }}
            className="absolute right-3 top-3 rounded-full bg-background/80 p-2 backdrop-blur-sm transition-colors hover:bg-background"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
          </button>
          {item.popular && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              Popular
            </span>
          )}
          <motion.button
            onClick={quickAdd}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-display font-semibold leading-tight">{item.name}</h3>
            <span className="ml-2 whitespace-nowrap font-semibold text-primary">${item.price.toFixed(2)}</span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
          <div className="mt-3 flex items-center gap-1 text-sm">
            <Star className="h-3.5 w-3.5 fill-cafe-amber text-cafe-amber" />
            <span className="font-medium">{item.rating}</span>
            <span className="text-muted-foreground">({item.reviews})</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MenuCard;
