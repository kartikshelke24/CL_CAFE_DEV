import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Sun, Moon, User, LogOut, Coffee, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { subdomain } = useParams();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();

  // Determine if we are on a cafe sub-site or the main marketing site
  const isCafeSite = location.pathname.startsWith("/v/");
  const currentCafe = subdomain || "brew-haven";
  
  const cafeData = isCafeSite ? JSON.parse(localStorage.getItem(`cafe_${currentCafe}`) || '{"cafeName": "Brew Haven"}') : null;

  const links = isCafeSite ? [
    { to: `/v/${currentCafe}`, label: "Home" },
    { to: `/v/${currentCafe}/menu`, label: "Menu" },
    { to: `/v/${currentCafe}/cart`, label: "Cart" },
    ...(isAuthenticated ? [{ to: "/orders", label: "My Orders" }] : []),
  ] : [
    { to: "/", label: "Home" },
    { to: "/#features", label: "Features" },
    { to: "/#pricing", label: "Pricing" },
    { to: "/register", label: "Register Cafe" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to={isCafeSite ? `/v/${currentCafe}` : "/"} className="flex items-center gap-2">
          <Coffee className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">
            {isCafeSite ? cafeData.cafeName : "CloudCafe OS"}
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} className="text-muted-foreground">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {isCafeSite && (
            <Link to={`/v/${currentCafe}/cart`} className="relative">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <ShoppingCart className="h-4 w-4" />
              </Button>
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {user?.role === "admin" && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="hidden gap-2 md:flex">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Button>
                </Link>
              )}
              <div className="hidden items-center gap-2 md:flex">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {user?.avatar}
                </span>
                <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-1">
                <User className="h-3.5 w-3.5" /> Sign In
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {l.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="mt-2 w-full" size="sm">Sign In</Button>
                </Link>
              )}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  className="mt-2 justify-start gap-2"
                  onClick={() => { logout(); setMobileOpen(false); navigate("/"); }}
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
