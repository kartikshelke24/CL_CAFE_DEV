import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Zap, 
  Smartphone, 
  BarChart3, 
  ShieldCheck, 
  QrCode, 
  ArrowRight,
  Coffee,
  Globe,
  Utensils
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "QR Based Ordering",
    description: "Digital menu and instant ordering from the table. No apps required for customers.",
    icon: QrCode,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    title: "Real-time Analytics",
    description: "Track sales, popular items, and peak hours with our intuitive dashboard.",
    icon: BarChart3,
    color: "text-green-500",
    bg: "bg-green-50"
  },
  {
    title: "Mobile First Design",
    description: "Beautifully optimized for staff and customer smartphones. Work from anywhere.",
    icon: Smartphone,
    color: "text-purple-500",
    bg: "bg-purple-50"
  },
  {
    title: "Inventory Management",
    description: "Keep track of your stock levels and get alerts when items are running low.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    title: "Secure & Reliable",
    description: "Enterprise-grade security for your data and payments. 99.9% uptime guaranteed.",
    icon: ShieldCheck,
    color: "text-red-500",
    bg: "bg-red-50"
  },
  {
    title: "Multi-branch Ready",
    description: "Manage multiple locations from a single admin account effortlessly.",
    icon: Globe,
    color: "text-cyan-500",
    bg: "bg-cyan-50"
  }
];

const plans = [
  {
    name: "Starter",
    price: "₹999",
    period: "/month",
    description: "Perfect for small coffee shops and food stalls.",
    features: ["Digital Menu (QR)", "Up to 10 Tables", "Basic Sales Reports", "Email Support"],
    buttonText: "Start Free Trial",
    popular: false
  },
  {
    name: "Pro",
    price: "₹2,499",
    period: "/month",
    description: "For busy restaurants needing advanced tools.",
    features: ["Everything in Starter", "Unlimited Tables", "Advanced Analytics", "Inventory Management", "Priority Support"],
    buttonText: "Get Started Pro",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Tailored solutions for restaurant chains.",
    features: ["Everything in Pro", "Multi-branch Management", "API Access", "Dedicated Account Manager", "Custom Integration"],
    buttonText: "Contact Sales",
    popular: false
  }
];

const SoftwareLanding = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-950 text-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider uppercase bg-primary/20 text-primary rounded-full border border-primary/30">
              The Future of Dining is Here
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Transform Your Cafe with <br /> 
              <span className="text-primary">CloudCafe OS</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-400 mb-10">
              The all-in-one platform for QR ordering, staff management, and growth analytics. 
              Built for modern cafes, restaurants, and bars.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="px-8 h-14 text-lg rounded-full shadow-lg shadow-primary/25">
                  Register Your Cafe <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 h-14 text-lg rounded-full border-slate-700 hover:bg-slate-900 text-white">
                View Live Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-900 border-y border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Cafes", value: "500+" },
              { label: "Orders Processed", value: "1M+" },
              { label: "Customer Rating", value: "4.9/5" },
              { label: "Revenue Generated", value: "₹50Cr+" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-slate-500 text-lg">
              Powerful tools designed to simplify your operations and enhance the customer experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-slate-100 dark:border-slate-800 hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Demo Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">Revolutionize the way customers order</h2>
              <div className="space-y-6">
                {[
                  { title: "No App Required", desc: "Customers just scan and order. Works on any smartphone browser." },
                  { title: "Beautiful Visual Menu", desc: "Showcase your food with stunning photography and descriptions." },
                  { title: "Instant Payments", desc: "Integrated UPI, Cards, and Wallets for frictionless checkout." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/register">
                  <Button size="lg" className="rounded-full px-8">Get Started Now</Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative z-10 bg-white dark:bg-slate-800 rounded-[2rem] p-4 shadow-2xl border-8 border-slate-200 dark:border-slate-700 max-w-[320px] mx-auto">
                <div className="bg-slate-100 dark:bg-slate-900 rounded-[1.5rem] overflow-hidden aspect-[9/19] flex flex-col">
                  {/* Phone Header */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <Coffee className="h-5 w-5 text-primary" />
                    <span className="text-xs font-bold">Brew Haven Cafe</span>
                    <div className="w-5" />
                  </div>
                  {/* Phone Content */}
                  <div className="flex-1 p-4 space-y-4">
                    <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                      <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    </div>
                  </div>
                  {/* Phone Footer */}
                  <div className="p-4 bg-primary text-white text-center font-bold text-sm">
                    VIEW CART (3 ITEMS)
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }} 
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 right-0 z-20 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">New Order!</div>
                    <div className="text-[10px] text-slate-500">Table #4 • ₹450</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-500 text-lg">
              No hidden fees. Choose the plan that works best for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`h-full flex flex-col ${plan.popular ? 'border-primary border-2 shadow-xl scale-105' : 'border-slate-100 dark:border-slate-800'}`}>
                  {plan.popular && (
                    <div className="bg-primary text-white text-xs font-bold py-1 text-center uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-slate-500">{plan.period}</span>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Link to="/register" className="w-full">
                      <Button variant={plan.popular ? "default" : "outline"} className="w-full py-6 font-bold">
                        {plan.buttonText}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">Ready to digitize your cafe?</h2>
          <p className="text-primary-foreground/80 text-lg mb-10 max-w-2xl mx-auto">
            Join 500+ businesses already using CloudCafe OS to manage their operations and grow their revenue.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="px-10 h-14 text-lg rounded-full font-bold">
              Register Now - 14 Day Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 text-slate-400 border-t border-slate-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 text-white font-bold text-2xl mb-6">
                <Coffee className="h-8 w-8 text-primary" />
                CloudCafe OS
              </div>
              <p className="max-w-sm mb-6">
                Making restaurant management simpler, smarter, and more profitable through digital innovation.
              </p>
              <div className="flex gap-4">
                {/* Social links placeholder */}
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:text-white transition-colors cursor-pointer">
                  <Globe className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Support</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-900 text-center text-sm">
            © 2026 CloudCafe OS. All rights reserved. Built with ❤️ for the hospitality industry.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SoftwareLanding;
