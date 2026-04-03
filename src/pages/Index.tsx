import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Star, ChevronLeft, ChevronRight, Coffee, QrCode, Clock, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { menuItems, categories, testimonials } from "@/data/menu";
import { Button } from "@/components/ui/button";
import MenuCard from "@/components/menu/MenuCard";
import heroCoffee from "@/assets/hero-coffee.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Home = () => {
  const { subdomain } = useParams();
  const [cafeData, setCafeData] = useState<any>(null);
  const featured = menuItems.filter((i) => i.popular).slice(0, 4);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    // Try to load cafe data from localStorage
    const savedCafe = localStorage.getItem(`cafe_${subdomain}`);
    if (savedCafe) {
      setCafeData(JSON.parse(savedCafe));
    } else if (subdomain === "brew-haven" || !subdomain) {
      // Default demo data for Brew Haven
      setCafeData({
        cafeName: "Brew Haven",
        primaryColor: "#B7791F",
        address: "123 Coffee Lane, Barista District",
        contactNumber: "+1 (555) 123-4567"
      });
    }
  }, [subdomain]);

  if (!cafeData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Coffee className="h-12 w-12 animate-pulse text-primary" />
        <h2 className="mt-4 text-xl font-bold">Loading Cafe...</h2>
      </div>
    );
  }

  const primaryColor = cafeData.primaryColor || "#B7791F";

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <img
          src={heroCoffee}
          alt="Premium coffee"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="gradient-hero absolute inset-0" />
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4 inline-block rounded-full bg-cafe-amber/20 px-4 py-1.5 text-sm font-medium text-cafe-amber"
            >
              Welcome to {cafeData.cafeName}
            </motion.span>
            <h1 className="font-display text-5xl font-bold leading-tight text-cafe-cream md:text-7xl" style={{ color: "hsl(35 40% 96%)" }}>
              Where Every Sip <br />
              <span className="italic" style={{ color: primaryColor }}>Tells a Story</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg" style={{ color: "hsl(35 20% 80%)" }}>
              Discover handcrafted beverages made from the finest single-origin beans,
              served in a space designed for connection.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={subdomain ? `/v/${subdomain}/menu` : "/menu"}>
                <Button size="lg" className="gap-2 rounded-full px-8" style={{ backgroundColor: primaryColor }}>
                  Explore Menu <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to={subdomain ? `/v/${subdomain}/qr-order` : "/menu"}>
                <Button size="lg" variant="outline" className="rounded-full border-cafe-cream/30 px-8" style={{ color: "hsl(35 40% 96%)", borderColor: "hsl(35 40% 96% / 0.3)" }}>
                  <QrCode className="mr-2 h-4 w-4" /> Scan & Order
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Browse by Category</h2>
            <p className="mt-2 text-muted-foreground">Find exactly what you're craving</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Link
                  to={`/menu?category=${cat.id}`}
                  className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-glow"
                >
                  <span className="text-4xl">{cat.icon}</span>
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.count} items</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold md:text-4xl">Customer Favorites</h2>
              <p className="mt-2 text-muted-foreground">Our most loved items</p>
            </div>
            <Link to="/menu" className="hidden text-sm font-medium text-primary hover:underline md:block">
              View All →
            </Link>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="relative overflow-hidden rounded-2xl gradient-warm p-8 md:p-12">
            <div className="relative z-10 max-w-lg">
              <span className="mb-2 inline-block rounded-full bg-background/20 px-3 py-1 text-sm font-medium text-primary-foreground">
                Limited Offer
              </span>
              <h3 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
                Get 20% Off Your First Order
              </h3>
              <p className="mt-3 text-primary-foreground/80">
                Use code <strong>WELCOME10</strong> at checkout. Valid for new customers only.
              </p>
              <Link to="/menu">
                <Button size="lg" variant="secondary" className="mt-6 rounded-full">
                  Order Now
                </Button>
              </Link>
            </div>
            <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-background/10 blur-3xl" />
            <div className="absolute -bottom-12 right-20 h-48 w-48 rounded-full bg-background/5 blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-cafe-coffee/5 py-20 dark:bg-cafe-coffee/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="mb-6 font-display text-4xl font-bold md:text-5xl">Find Us Here</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <MapPin className="h-6 w-6 text-cafe-amber" />
                  <p className="text-lg">{cafeData.address}</p>
                </div>
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <Phone className="h-6 w-6 text-cafe-amber" />
                  <p className="text-lg">{cafeData.contactNumber}</p>
                </div>
              </div>
              <div className="mt-10">
                <Button variant="outline" className="rounded-full px-8">Get Directions</Button>
              </div>
            </div>
            <div className="h-[400px] w-full max-w-2xl overflow-hidden rounded-[2rem] shadow-2xl grayscale transition-all hover:grayscale-0">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop" 
                alt="Cafe Interior"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">What People Say</h2>
            <p className="mt-2 text-muted-foreground">Real words from coffee lovers</p>
          </motion.div>
          <div className="mx-auto max-w-2xl">
            <motion.div
              key={testimonialIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl border border-border bg-card p-8 text-center"
            >
              <div className="mb-4 flex justify-center gap-1">
                {Array.from({ length: testimonials[testimonialIdx].rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-cafe-amber text-cafe-amber" />
                ))}
              </div>
              <p className="font-display text-lg italic text-foreground">
                "{testimonials[testimonialIdx].text}"
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {testimonials[testimonialIdx].avatar}
                </span>
                <span className="font-medium">{testimonials[testimonialIdx].name}</span>
              </div>
            </motion.div>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTestimonialIdx((i) => (i + 1) % testimonials.length)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
