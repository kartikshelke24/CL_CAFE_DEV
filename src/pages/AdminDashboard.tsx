import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, ChevronLeft,
  TrendingUp, DollarSign, Clock, Package, Grid3X3, Tag,
} from "lucide-react";
import { useOrderStore, type OrderStatus } from "@/stores/orderStore";
import { useMenuStore } from "@/stores/menuStore";
import { useTableStore } from "@/stores/tableStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { Button } from "@/components/ui/button";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { lazy, Suspense } from "react";

const CategoriesPage = lazy(() => import("./admin/CategoriesPage"));
const TablesPage = lazy(() => import("./admin/TablesPage"));
const MenuManagePage = lazy(() => import("./admin/MenuManagePage"));

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "categories", label: "Categories", icon: Tag },
  { id: "tables", label: "Tables", icon: Grid3X3 },
  { id: "users", label: "Users", icon: Users },
];

const CHART_COLORS = ["hsl(25,65%,28%)", "hsl(35,80%,50%)", "hsl(140,15%,45%)", "hsl(15,35%,30%)", "hsl(40,90%,55%)", "hsl(30,30%,80%)"];

const mockUsers = [
  { id: "1", name: "Alice W.", email: "alice@example.com", role: "customer", orders: 12 },
  { id: "2", name: "Bob M.", email: "bob@example.com", role: "customer", orders: 8 },
  { id: "3", name: "Carol S.", email: "carol@example.com", role: "staff", orders: 0 },
  { id: "4", name: "Dave R.", email: "dave@example.com", role: "admin", orders: 3 },
];

const Loading = () => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { orders, updateStatus } = useOrderStore();
  const { items: menuItems } = useMenuStore();
  const { tables } = useTableStore();
  const { categories } = useCategoryStore();
  const [orderFilter, setOrderFilter] = useState<"all" | OrderStatus>("all");

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const activeTables = tables.filter((t) => t.status === "occupied").length;

  const categoryData = Object.entries(
    menuItems.reduce<Record<string, number>>((acc, item) => {
      const catName = categories.find((c) => c.id === item.categoryId)?.name || item.category;
      acc[catName] = (acc[catName] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const revenueData = [
    { day: "Mon", revenue: 320 }, { day: "Tue", revenue: 450 }, { day: "Wed", revenue: 280 },
    { day: "Thu", revenue: 520 }, { day: "Fri", revenue: 680 }, { day: "Sat", revenue: 890 }, { day: "Sun", revenue: 760 },
  ];

  const filteredOrders = orderFilter === "all" ? orders : orders.filter((o) => o.status === orderFilter);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col border-r border-border bg-card"
      >
        <div className="flex items-center justify-between border-b border-border p-3">
          {sidebarOpen && <span className="font-display font-bold">Admin</span>}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <ChevronLeft className={`h-4 w-4 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6">
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <h1 className="font-display text-2xl font-bold">Dashboard</h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-primary" },
                { label: "Orders", value: orders.length, icon: ShoppingBag, color: "text-accent" },
                { label: "Active Tables", value: `${activeTables}/${tables.length}`, icon: Grid3X3, color: "text-primary" },
                { label: "Menu Items", value: menuItems.length, icon: Package, color: "text-muted-foreground" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Popular Items */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 font-display font-semibold">Popular Items</h3>
              <div className="flex flex-wrap gap-2">
                {menuItems.filter((i) => i.tags.includes("bestseller")).slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
                    <img src={item.image} alt={item.name} className="h-8 w-8 rounded object-cover" />
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-display font-semibold">Weekly Revenue</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30,15%,88%)" />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="hsl(25,65%,28%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-4 font-display font-semibold">Menu Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h1 className="font-display text-2xl font-bold">Orders</h1>
            <div className="flex gap-2">
              {(["all", "confirmed", "preparing", "ready", "delivered"] as const).map((f) => (
                <Button key={f} variant={orderFilter === f ? "default" : "outline"} size="sm" onClick={() => setOrderFilter(f)} className="capitalize">
                  {f}
                </Button>
              ))}
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    {["Order ID", "Customer", "Type", "Table", "Items", "Total", "Status", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{order.id}</td>
                      <td className="px-4 py-3">{order.customerName}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          order.orderType === "dine-in" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                        }`}>{order.orderType || "takeaway"}</span>
                      </td>
                      <td className="px-4 py-3">{order.tableId ? tables.find((t) => t.id === order.tableId)?.name || order.tableId : "—"}</td>
                      <td className="px-4 py-3">{order.items.length}</td>
                      <td className="px-4 py-3">${order.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium capitalize">{order.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                          className="rounded border border-border bg-card px-2 py-1 text-xs"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && <p className="p-8 text-center text-muted-foreground">No orders found</p>}
            </div>
          </motion.div>
        )}

        {activeTab === "menu" && (
          <Suspense fallback={<Loading />}><MenuManagePage /></Suspense>
        )}

        {activeTab === "categories" && (
          <Suspense fallback={<Loading />}><CategoriesPage /></Suspense>
        )}

        {activeTab === "tables" && (
          <Suspense fallback={<Loading />}><TablesPage /></Suspense>
        )}

        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h1 className="font-display text-2xl font-bold">Users</h1>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    {["Name", "Email", "Role", "Orders"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map((u) => (
                    <tr key={u.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium capitalize">{u.role}</span></td>
                      <td className="px-4 py-3">{u.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
