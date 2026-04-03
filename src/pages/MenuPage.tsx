import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Grid3X3, List, X, Table, Info } from "lucide-react";
import { menuItems as defaultMenuItems, categories as defaultCategories } from "@/data/menu";
import MenuCard from "@/components/menu/MenuCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTableStore } from "@/stores/tableStore";
import { Badge } from "@/components/ui/badge";

const MenuPage = () => {
  const { subdomain } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20]);
  const [showFilters, setShowFilters] = useState(false);

  // Dynamic Data Loading
  const cafeData = useMemo(() => {
    const saved = localStorage.getItem(`cafe_${subdomain}`);
    return saved ? JSON.parse(saved) : null;
  }, [subdomain]);

  const menuItems = cafeData?.menuItems || defaultMenuItems;
  const categories = cafeData?.categories || defaultCategories;

  const tableId = searchParams.get("tableId");
  const { tables } = useTableStore();
  const activeTable = tableId ? tables.find(t => t.id === tableId) : null;

  const activeCategory = searchParams.get("category") || "all";

  const filtered = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== "all") items = items.filter((i) => i.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    items = items.filter((i) => i.price >= priceRange[0] && i.price <= priceRange[1]);
    switch (sort) {
      case "price-asc": return [...items].sort((a, b) => a.price - b.price);
      case "price-desc": return [...items].sort((a, b) => b.price - a.price);
      case "rating": return [...items].sort((a, b) => b.rating - a.rating);
      case "popular": return [...items].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      default: return items;
    }
  }, [activeCategory, search, sort, priceRange]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Our Menu</h1>
          <p className="mt-2 text-muted-foreground">Discover your new favorite</p>
        </motion.div>

        {activeTable && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3 rounded-full border border-cafe-amber/30 bg-cafe-amber/10 px-4 py-2 text-cafe-amber"
          >
            <Table className="h-5 w-5" />
            <div className="text-sm font-bold">Dine-in: Table {activeTable.name}</div>
            <Badge variant="outline" className="border-cafe-amber/30 text-[10px] text-cafe-amber">Active Session</Badge>
          </motion.div>
        )}
      </div>

      {/* Info banner for QR ordering */}
      {activeTable && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-sm text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/10 dark:text-blue-400"
        >
          <Info className="h-4 w-4 shrink-0" />
          <p>You are ordering for <strong>Table {activeTable.name}</strong>. Your order will be served directly to your table.</p>
        </motion.div>
      )}

      {/* Search & Controls */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value="popular">Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
          <Button variant={view === "grid" ? "default" : "outline"} size="icon" onClick={() => setView("grid")}>
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant={view === "list" ? "default" : "outline"} size="icon" onClick={() => setView("list")}>
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          size="sm"
          className="rounded-full"
          onClick={() => setSearchParams({})}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => setSearchParams({ category: cat.id })}
          >
            {cat.icon} {cat.name}
          </Button>
        ))}
      </div>

      {/* Price filter */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? "auto" : 0, opacity: showFilters ? 1 : 0 }}
        className="overflow-hidden md:!h-auto md:!opacity-100"
      >
        <div className="mt-4 flex items-center gap-4 rounded-lg border border-border bg-card p-4">
          <span className="text-sm font-medium">Price:</span>
          <input
            type="range"
            min={0}
            max={20}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="flex-1 accent-primary"
          />
          <span className="text-sm text-muted-foreground">Up to ${priceRange[1]}</span>
        </div>
      </motion.div>

      {/* Results */}
      <div className="mt-4 text-sm text-muted-foreground">{filtered.length} items found</div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium">No items found</p>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        <div className={view === "grid"
          ? "mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "mt-6 flex flex-col gap-4"
        }>
          {filtered.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} view={view} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
