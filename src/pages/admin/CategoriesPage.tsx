import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useCategoryStore } from "@/stores/categoryStore";

const CategoriesPage = () => {
  const {
    categories,
    loadCategories,
    saveCategory,
    deleteCategory,
  } = useCategoryStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    icon: "☕",
    displayOrder: 1,
  });

  // ==========================
  // 🔹 LOAD DATA
  // ==========================
  useEffect(() => {
    loadCategories().catch((err: any) => {
      toast.error(err?.Msg || "Failed to load");
    });
  }, []);

  // ==========================
  // 🔹 OPEN ADD
  // ==========================
  const openAdd = () => {
    setEditing(null);
    setForm({
      name: "",
      icon: "☕",
      displayOrder: categories.length + 1,
    });
    setModalOpen(true);
  };

  // ==========================
  // 🔹 OPEN EDIT
  // ==========================
  const openEdit = (cat: any) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      icon: cat.icon,
      displayOrder: cat.displayOrder,
    });
    setModalOpen(true);
  };

  // ==========================
  // 🔹 SAVE
  // ==========================
  const handleSave = async () => {
    try {
      if (!form.name.trim()) {
        toast.error("Category name required");
        return;
      }

      const res = await saveCategory(form, editing?.id);

      if (res.msgId === 1) {
        toast.success(res.Msg || "Saved successfully");
        setModalOpen(false);
      } else if (res.msgId === 0) {
        toast.warning(res.Msg);
      } else {
        toast.error(res.Msg);
      }
    } catch (err: any) {
      toast.error(err?.Msg || "Something went wrong");
    }
  };

  // ==========================
  // 🔹 DELETE
  // ==========================
  const handleDelete = async () => {
    try {
      if (!deleteId) return;

      const res = await deleteCategory(deleteId);

      if (res.msgId === 1) {
        toast.success("Deleted successfully");
        setDeleteId(null);
      } else {
        toast.error(res.Msg);
      }
    } catch (err: any) {
      toast.error(err?.Msg || "Delete failed");
    }
  };

  const sorted = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </Button>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Icon</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {sorted.map((cat) => (
                <motion.tr key={cat.id} layout className="border-t">
                  <td className="p-3 text-xl">{cat.icon}</td>
                  <td className="p-3 font-medium">{cat.name}</td>
                  <td className="p-3">{cat.displayOrder}</td>
                  <td className="p-3">
                    {cat.isActive ? "Active" : "Inactive"}
                  </td>

                  <td className="p-3 flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(cat)}>
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button size="icon" variant="ghost" onClick={() => setDeleteId(cat.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Category Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Input
              placeholder="Icon (emoji)"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />

            <Input
              type="number"
              value={form.displayOrder}
              onChange={(e) =>
                setForm({ ...form, displayOrder: Number(e.target.value) })
              }
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </motion.div>
  );
};

export default CategoriesPage;
































// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
// import { useCategoryStore, type Category, type DietType } from "@/stores/categoryStore";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
// } from "@/components/ui/dialog";
// import {
//   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
//   AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { toast } from "sonner";

// const EMOJI_OPTIONS = ["☕", "🍵", "🥐", "🥤", "🥪", "🍰", "🍕", "🥗", "🍔", "🧁", "🍩", "🥞"];

// const CategoriesPage = () => {
//   const { categories, addCategory, updateCategory, deleteCategory, toggleActive } = useCategoryStore();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [editingCat, setEditingCat] = useState<Category | null>(null);
//   const [form, setForm] = useState({ name: "", type: "veg" as DietType, icon: "☕", displayOrder: 1 });

//   const openAdd = () => {
//     setEditingCat(null);
//     setForm({ name: "", type: "veg", icon: "☕", displayOrder: categories.length + 1 });
//     setModalOpen(true);
//   };

//   const openEdit = (cat: Category) => {
//     setEditingCat(cat);
//     setForm({ name: cat.name, type: cat.type, icon: cat.icon, displayOrder: cat.displayOrder });
//     setModalOpen(true);
//   };

//   const handleSave = () => {
//     if (!form.name.trim()) { toast.error("Category name is required"); return; }
//     if (editingCat) {
//       updateCategory(editingCat.id, form);
//       toast.success("Category updated");
//     } else {
//       addCategory({ ...form, isActive: true });
//       toast.success("Category added");
//     }
//     setModalOpen(false);
//   };

//   const handleDelete = () => {
//     if (deleteId) { deleteCategory(deleteId); toast.success("Category deleted"); setDeleteId(null); }
//   };

//   const sorted = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

//   return (
//     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="font-display text-2xl font-bold">Categories</h1>
//         <Button onClick={openAdd} className="gap-1.5"><Plus className="h-4 w-4" /> Add Category</Button>
//       </div>

//       <div className="overflow-x-auto rounded-xl border border-border">
//         <table className="w-full text-sm">
//           <thead className="bg-secondary">
//             <tr>
//               {["Order", "Icon", "Name", "Type", "Status", "Actions"].map((h) => (
//                 <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             <AnimatePresence>
//               {sorted.map((cat) => (
//                 <motion.tr
//                   key={cat.id}
//                   layout
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="border-t border-border"
//                 >
//                   <td className="px-4 py-3 font-medium">{cat.displayOrder}</td>
//                   <td className="px-4 py-3 text-xl">{cat.icon}</td>
//                   <td className="px-4 py-3 font-medium">{cat.name}</td>
//                   <td className="px-4 py-3">
//                     <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
//                       cat.type === "veg" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
//                       cat.type === "vegan" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
//                       "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
//                     }`}>
//                       {cat.type}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <button onClick={() => toggleActive(cat.id)} className="flex items-center gap-1.5">
//                       {cat.isActive ? (
//                         <><ToggleRight className="h-5 w-5 text-primary" /><span className="text-xs text-primary">Active</span></>
//                       ) : (
//                         <><ToggleLeft className="h-5 w-5 text-muted-foreground" /><span className="text-xs text-muted-foreground">Inactive</span></>
//                       )}
//                     </button>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex gap-1">
//                       <Button size="icon" variant="ghost" onClick={() => openEdit(cat)}><Pencil className="h-4 w-4" /></Button>
//                       <Button size="icon" variant="ghost" onClick={() => setDeleteId(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))}
//             </AnimatePresence>
//           </tbody>
//         </table>
//       </div>

//       {/* Add/Edit Modal */}
//       <Dialog open={modalOpen} onOpenChange={setModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{editingCat ? "Edit Category" : "Add Category"}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label>Name</Label>
//               <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" />
//             </div>
//             <div>
//               <Label>Type</Label>
//               <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as DietType })}>
//                 <SelectTrigger><SelectValue /></SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="veg">Veg</SelectItem>
//                   <SelectItem value="non-veg">Non-Veg</SelectItem>
//                   <SelectItem value="vegan">Vegan</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div>
//               <Label>Icon</Label>
//               <div className="mt-1 flex flex-wrap gap-2">
//                 {EMOJI_OPTIONS.map((e) => (
//                   <button
//                     key={e}
//                     onClick={() => setForm({ ...form, icon: e })}
//                     className={`rounded-lg border p-2 text-xl transition-all ${form.icon === e ? "border-primary bg-primary/10 scale-110" : "border-border hover:border-primary/50"}`}
//                   >
//                     {e}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <Label>Display Order</Label>
//               <Input type="number" min={1} value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 1 })} />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
//             <Button onClick={handleSave}>{editingCat ? "Update" : "Add"}</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Confirmation */}
//       <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Category?</AlertDialogTitle>
//             <AlertDialogDescription>This action cannot be undone. Menu items in this category won't be affected.</AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </motion.div>
//   );
// };

// export default CategoriesPage;
