import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, ArrowLeft, ArrowRight, X } from "lucide-react";
import { useMenuStore, type ManagedMenuItem, type ItemTag } from "@/stores/menuStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const STEPS = ["Basic Info", "Pricing & Tags", "Customizations"];

const defaultSizes = [
  { name: "Small", priceAdd: 0 },
  { name: "Medium", priceAdd: 0.5 },
  { name: "Large", priceAdd: 1.0 },
];
const defaultAddOns = [
  { name: "Extra Shot", price: 0.75 },
  { name: "Whipped Cream", price: 0.5 },
  { name: "Oat Milk", price: 0.6 },
];

const MenuManagePage = () => {
  const { items, addItem, updateItem, deleteItem, toggleAvailability } = useMenuStore();
  const { categories } = useCategoryStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ManagedMenuItem | null>(null);
  const [step, setStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  const [form, setForm] = useState({
    name: "", description: "", categoryId: "cat_1", type: "veg" as "veg" | "non-veg" | "vegan",
    price: "", discountPrice: "", image: "", rating: "4.5", reviews: "0",
    isAvailable: true, tags: [] as ItemTag[],
    sizes: defaultSizes, addOns: defaultAddOns,
    sugarLevels: ["No Sugar", "Less Sugar", "Normal", "Extra Sweet"],
    iceLevels: ["No Ice", "Less Ice", "Normal", "Extra Ice"],
  });

  const openAdd = () => {
    setEditingItem(null);
    setStep(0);
    setForm({
      name: "", description: "", categoryId: categories[0]?.id || "cat_1", type: "veg",
      price: "", discountPrice: "", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600",
      rating: "4.5", reviews: "0", isAvailable: true, tags: [],
      sizes: defaultSizes, addOns: defaultAddOns,
      sugarLevels: ["No Sugar", "Less Sugar", "Normal", "Extra Sweet"],
      iceLevels: ["No Ice", "Less Ice", "Normal", "Extra Ice"],
    });
    setModalOpen(true);
  };

  const openEdit = (item: ManagedMenuItem) => {
    setEditingItem(item);
    setStep(0);
    setForm({
      name: item.name, description: item.description, categoryId: item.categoryId, type: item.type,
      price: item.price.toString(), discountPrice: item.discountPrice?.toString() || "",
      image: item.image, rating: item.rating.toString(), reviews: item.reviews.toString(),
      isAvailable: item.isAvailable, tags: item.tags,
      sizes: item.customizations.sizes, addOns: item.customizations.addOns,
      sugarLevels: item.customizations.sugarLevels, iceLevels: item.customizations.iceLevels,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) { toast.error("Name and price are required"); return; }
    const catObj = categories.find((c) => c.id === form.categoryId);
    const data: any = {
      name: form.name, description: form.description, categoryId: form.categoryId,
      category: catObj?.name.toLowerCase() || "coffee",
      type: form.type, price: parseFloat(form.price),
      discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : undefined,
      image: form.image, rating: parseFloat(form.rating) || 4.5, reviews: parseInt(form.reviews) || 0,
      popular: form.tags.includes("bestseller"), isAvailable: form.isAvailable, tags: form.tags,
      customizations: {
        sizes: form.sizes, addOns: form.addOns,
        sugarLevels: form.sugarLevels, iceLevels: form.iceLevels,
      },
    };
    if (editingItem) {
      updateItem(editingItem.id, data);
      toast.success("Menu item updated");
    } else {
      addItem(data);
      toast.success("Menu item added");
    }
    setModalOpen(false);
  };

  const toggleTag = (tag: ItemTag) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  };

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCat === "all" || item.categoryId === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Menu Items</h1>
        <Button onClick={openAdd} className="gap-1.5"><Plus className="h-4 w-4" /> Add Item</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-xs" />
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Items Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`rounded-xl border border-border bg-card overflow-hidden ${!item.isAvailable ? "opacity-60" : ""}`}
            >
              <div className="relative h-32">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                {item.tags.length > 0 && (
                  <div className="absolute left-2 top-2 flex gap-1">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground uppercase">{tag}</span>
                    ))}
                  </div>
                )}
                {!item.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                    <span className="rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">Unavailable</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{categories.find((c) => c.id === item.categoryId)?.name || item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${item.price.toFixed(2)}</p>
                    {item.discountPrice && (
                      <p className="text-xs text-primary">${item.discountPrice.toFixed(2)}</p>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-current text-yellow-500" /> {item.rating} ({item.reviews})
                </div>
                <div className="mt-3 flex gap-1">
                  <Button size="sm" variant="ghost" className="h-7 flex-1 text-xs" onClick={() => toggleAvailability(item.id)}>
                    {item.isAvailable ? <><EyeOff className="mr-1 h-3 w-3" /> Hide</> : <><Eye className="mr-1 h-3 w-3" /> Show</>}
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(item)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setDeleteId(item.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Multi-Step Form Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 pb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>{i + 1}</div>
                <span className="hidden text-xs sm:inline">{s}</span>
                {i < STEPS.length - 1 && <div className={`h-px w-6 ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Item name" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Category</Label>
                    <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as any })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="veg">Veg</SelectItem>
                        <SelectItem value="non-veg">Non-Veg</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                  {form.image && <img src={form.image} alt="Preview" className="mt-2 h-24 w-full rounded-lg object-cover" />}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Base Price ($)</Label>
                    <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  </div>
                  <div>
                    <Label>Discount Price ($)</Label>
                    <Input type="number" step="0.01" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} placeholder="Optional" />
                  </div>
                </div>
                <div>
                  <Label>Tags</Label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {(["bestseller", "new", "recommended"] as ItemTag[]).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all ${
                          form.tags.includes(tag) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={form.isAvailable} onCheckedChange={(v) => setForm({ ...form, isAvailable: !!v })} id="avail" />
                  <Label htmlFor="avail">Available for ordering</Label>
                </div>

                {/* Live Preview Card */}
                <div className="rounded-xl border border-border bg-secondary/50 p-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Preview</p>
                  <div className="flex gap-3">
                    {form.image && <img src={form.image} alt="" className="h-16 w-16 rounded-lg object-cover" />}
                    <div>
                      <p className="font-semibold">{form.name || "Item Name"}</p>
                      <p className="text-sm text-muted-foreground">{form.description || "Description"}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="font-bold">${form.price || "0.00"}</span>
                        {form.discountPrice && <span className="text-xs text-primary line-through">${form.discountPrice}</span>}
                        {form.tags.map((t) => (
                          <span key={t} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <Label>Sizes</Label>
                  <div className="mt-1 space-y-2">
                    {form.sizes.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input value={s.name} onChange={(e) => { const n = [...form.sizes]; n[i] = { ...n[i], name: e.target.value }; setForm({ ...form, sizes: n }); }} className="h-8 text-sm" placeholder="Size name" />
                        <Input type="number" step="0.01" value={s.priceAdd} onChange={(e) => { const n = [...form.sizes]; n[i] = { ...n[i], priceAdd: parseFloat(e.target.value) || 0 }; setForm({ ...form, sizes: n }); }} className="h-8 w-24 text-sm" placeholder="+$" />
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setForm({ ...form, sizes: form.sizes.filter((_, j) => j !== i) })}><X className="h-3 w-3" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => setForm({ ...form, sizes: [...form.sizes, { name: "", priceAdd: 0 }] })} className="text-xs"><Plus className="mr-1 h-3 w-3" /> Add Size</Button>
                  </div>
                </div>
                <div>
                  <Label>Add-ons</Label>
                  <div className="mt-1 space-y-2">
                    {form.addOns.map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Input value={a.name} onChange={(e) => { const n = [...form.addOns]; n[i] = { ...n[i], name: e.target.value }; setForm({ ...form, addOns: n }); }} className="h-8 text-sm" placeholder="Add-on name" />
                        <Input type="number" step="0.01" value={a.price} onChange={(e) => { const n = [...form.addOns]; n[i] = { ...n[i], price: parseFloat(e.target.value) || 0 }; setForm({ ...form, addOns: n }); }} className="h-8 w-24 text-sm" placeholder="$" />
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setForm({ ...form, addOns: form.addOns.filter((_, j) => j !== i) })}><X className="h-3 w-3" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => setForm({ ...form, addOns: [...form.addOns, { name: "", price: 0 }] })} className="text-xs"><Plus className="mr-1 h-3 w-3" /> Add-on</Button>
                  </div>
                </div>
                <div>
                  <Label>Sugar Levels</Label>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {form.sugarLevels.map((s) => (
                      <span key={s} className="rounded-full border border-border bg-secondary px-2 py-0.5 text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Ice Levels</Label>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {form.iceLevels.map((s) => (
                      <span key={s} className="rounded-full border border-border bg-secondary px-2 py-0.5 text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-1"><ArrowLeft className="h-4 w-4" /> Back</Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button className="flex-1 gap-1" onClick={() => setStep(step + 1)}>Next <ArrowRight className="h-4 w-4" /></Button>
            ) : (
              <Button className="flex-1" onClick={handleSave}>{editingItem ? "Update Item" : "Add Item"}</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu Item?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove this item from the menu.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteId) { deleteItem(deleteId); toast.success("Item deleted"); setDeleteId(null); } }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default MenuManagePage;
