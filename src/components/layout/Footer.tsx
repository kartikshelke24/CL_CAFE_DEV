import { Coffee, Instagram, Twitter, Facebook, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Coffee className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold">Brew Haven</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Crafting extraordinary coffee experiences since 2018. Every cup tells a story.
          </p>
          <div className="mt-4 flex gap-3">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="rounded-full bg-secondary p-2 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-display font-semibold">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[{ to: "/menu", label: "Menu" }, { to: "/cart", label: "Cart" }, { to: "/orders", label: "Orders" }].map((l) => (
              <Link key={l.to} to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{l.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-display font-semibold">Hours</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>Mon–Fri: 7:00 AM – 9:00 PM</p>
            <p>Sat–Sun: 8:00 AM – 10:00 PM</p>
          </div>
        </div>
        <div>
          <h4 className="mb-3 font-display font-semibold">Contact</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> 123 Coffee Lane, Brewville</p>
            <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> (555) 123-4567</p>
            <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> hello@brewhaven.cafe</p>
          </div>
        </div>
      </div>
      <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Brew Haven. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
