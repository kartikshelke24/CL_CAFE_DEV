import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
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
  const featured = menuItems.filter((i) => i.popular).slice(0, 4);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

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
              ✨ Freshly roasted daily
            </motion.span>
            <h1 className="font-display text-5xl font-bold leading-tight text-cafe-cream md:text-7xl" style={{ color: "hsl(35 40% 96%)" }}>
              Where Every Sip <br />
              <span className="italic text-cafe-amber">Tells a Story</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg" style={{ color: "hsl(35 20% 80%)" }}>
              Discover handcrafted beverages made from the finest single-origin beans,
              served in a space designed for connection.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/menu">
                <Button size="lg" className="gap-2 rounded-full px-8">
                  Explore Menu <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/menu">
                <Button size="lg" variant="outline" className="rounded-full border-cafe-cream/30 px-8" style={{ color: "hsl(35 40% 96%)", borderColor: "hsl(35 40% 96% / 0.3)" }}>
                  Order Now
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
