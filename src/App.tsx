import { Suspense, lazy, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useThemeStore } from "@/stores/themeStore";

const Index = lazy(() => import("./pages/Index"));
const MenuPage = lazy(() => import("./pages/MenuPage"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const QRScanPage = lazy(() => import("./pages/QRScanPage"));
const SoftwareLanding = lazy(() => import("./pages/SoftwareLanding"));
const RegistrationFlow = lazy(() => import("./pages/RegistrationFlow"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const StaffPanel = lazy(() => import("./pages/StaffPanel"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const ThemeInit = () => {
  const isDark = useThemeStore((s) => s.isDark);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
          <Routes>
            {/* Software Marketing Site */}
            <Route path="/" element={<SoftwareLanding />} />
            <Route path="/register" element={<RegistrationFlow />} />
            
            {/* Individual Cafe Websites (Dyanmic based on subdomain) */}
            <Route path="/v/:subdomain" element={<Index />} />
            <Route path="/v/:subdomain/menu" element={<MenuPage />} />
            <Route path="/v/:subdomain/cart" element={<CartPage />} />
            <Route path="/v/:subdomain/checkout" element={<CheckoutPage />} />
            <Route path="/v/:subdomain/qr-order" element={<QRScanPage />} />
            
            {/* Legacy/Default Routes (Redirect to brew-haven for demo) */}
            <Route path="/index" element={<Navigate to="/v/brew-haven" replace />} />
            <Route path="/menu" element={<Navigate to="/v/brew-haven/menu" replace />} />
            <Route path="/cart" element={<Navigate to="/v/brew-haven/cart" replace />} />
            <Route path="/checkout" element={<Navigate to="/v/brew-haven/checkout" replace />} />
            <Route path="/qr-order" element={<Navigate to="/v/brew-haven/qr-order" replace />} />
            
            {/* Admin & Shared Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
