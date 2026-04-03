import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Store, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Coffee,
  Globe,
  Mail,
  Phone,
  Lock,
  Palette,
  LayoutDashboard,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { defaultCategories, defaultMenuItems, defaultTables } from "@/data/defaultCafeData";

const steps = [
  { id: 1, title: "Account", icon: User },
  { id: 2, title: "Cafe Details", icon: Store },
  { id: 3, title: "Brand & Style", icon: Palette },
  { id: 4, title: "Plan", icon: CreditCard },
  { id: 5, title: "Finish", icon: CheckCircle2 }
];

const RegistrationFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Account Info
    ownerName: "",
    email: "",
    password: "",
    // Cafe Details
    cafeName: "",
    subdomain: "",
    contactNumber: "",
    cafeEmail: "",
    // Brand & Style
    address: "",
    primaryColor: "#B7791F",
    secondaryColor: "#1A202C",
    logoUrl: "",
    // Plan
    selectedPlan: "Pro"
  });

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      // Basic validation for each step
      if (currentStep === 1) {
        if (!formData.ownerName || !formData.email || !formData.password) {
          toast.error("Please fill all account details");
          return;
        }
      } else if (currentStep === 2) {
        if (!formData.cafeName || !formData.subdomain || !formData.contactNumber) {
          toast.error("Please fill all cafe details");
          return;
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Simulate saving to DB
    const cafeData = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      // Initial Setup Data
      categories: defaultCategories,
      menuItems: defaultMenuItems,
      tables: defaultTables
    };
    
    // Save to localStorage for demo
    const registeredCafes = JSON.parse(localStorage.getItem("registeredCafes") || "[]");
    registeredCafes.push(cafeData);
    localStorage.setItem("registeredCafes", JSON.stringify(registeredCafes));
    
    // Also save as current active cafe for the sub-site simulation
    localStorage.setItem(`cafe_${formData.subdomain}`, JSON.stringify(cafeData));

    toast.success("Registration Successful!");
    setCurrentStep(5);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="ownerName" 
                  placeholder="John Doe" 
                  className="pl-10" 
                  value={formData.ownerName}
                  onChange={e => updateFormData({ ownerName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  className="pl-10" 
                  value={formData.email}
                  onChange={e => updateFormData({ email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10" 
                  value={formData.password}
                  onChange={e => updateFormData({ password: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cafeName">Cafe/Restaurant Name</Label>
              <div className="relative">
                <Coffee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="cafeName" 
                  placeholder="The Brew House" 
                  className="pl-10" 
                  value={formData.cafeName}
                  onChange={e => updateFormData({ cafeName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subdomain">Choose Your Unique Link (Subdomain)</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="subdomain" 
                    placeholder="brewhouse" 
                    className="pl-10" 
                    value={formData.subdomain}
                    onChange={e => updateFormData({ subdomain: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground">.cloudcafe.com</span>
              </div>
              <p className="text-[10px] text-muted-foreground">This will be your customer ordering link.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="contact" 
                    placeholder="+91 98765 43210" 
                    className="pl-10" 
                    value={formData.contactNumber}
                    onChange={e => updateFormData({ contactNumber: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cafeEmail">Business Email (Optional)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="cafeEmail" 
                    placeholder="hello@cafe.com" 
                    className="pl-10" 
                    value={formData.cafeEmail}
                    onChange={e => updateFormData({ cafeEmail: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="address" 
                  placeholder="123, Street Name, City" 
                  className="pl-10" 
                  value={formData.address}
                  onChange={e => updateFormData({ address: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Brand Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="primaryColor" 
                    type="color" 
                    className="w-12 h-10 p-1" 
                    value={formData.primaryColor}
                    onChange={e => updateFormData({ primaryColor: e.target.value })}
                  />
                  <Input 
                    value={formData.primaryColor}
                    onChange={e => updateFormData({ primaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL (Optional)</Label>
                <Input 
                  id="logo" 
                  placeholder="https://example.com/logo.png" 
                  value={formData.logoUrl}
                  onChange={e => updateFormData({ logoUrl: e.target.value })}
                />
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-4 border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Live Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: formData.primaryColor }}>
                  <Coffee className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{formData.cafeName || "Cafe Name"}</h4>
                  <p className="text-[10px] text-slate-500">{formData.subdomain ? `${formData.subdomain}.cloudcafe.com` : "Your URL here"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <p className="text-sm text-center text-muted-foreground mb-4">Choose the plan that fits your business. You won't be charged until after your 14-day trial.</p>
            <div className="grid gap-4">
              {[
                { name: "Starter", price: "₹999/mo", icon: Zap },
                { name: "Pro", price: "₹2,499/mo", icon: Coffee },
                { name: "Enterprise", price: "Custom", icon: Globe }
              ].map(plan => (
                <div 
                  key={plan.name}
                  onClick={() => updateFormData({ selectedPlan: plan.name })}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.selectedPlan === plan.name 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formData.selectedPlan === plan.name ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800"}`}>
                      <plan.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold">{plan.name}</h4>
                      <p className="text-xs text-muted-foreground">All essential features included.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{plan.price}</div>
                    {formData.selectedPlan === plan.name && <CheckCircle2 className="h-4 w-4 text-primary ml-auto mt-1" />}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p className="text-muted-foreground mb-8">Your cafe <span className="text-primary font-bold">{formData.cafeName}</span> is now live on CloudCafe OS.</p>
            
            <div className="grid gap-4 mb-8">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900 text-left">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-3">Your Digital Storefront</p>
                <div className="flex items-center justify-between gap-4">
                  <div className="truncate">
                    <p className="text-sm font-bold text-primary">{formData.subdomain}.cloudcafe.com</p>
                    <p className="text-[10px] text-slate-500">Public link for customers</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/v/${formData.subdomain}`)}>Visit Site</Button>
                </div>
              </div>
              
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900 text-left">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-3">Admin Dashboard Credentials</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Username/Email:</span>
                    <span className="font-bold">{formData.email}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Password:</span>
                    <span className="font-bold">•••••••• (Your chosen pwd)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button className="w-full h-12 gap-2" onClick={() => navigate("/login")}>
              Login to Admin Dashboard <LayoutDashboard className="h-4 w-4" />
            </Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Stepper */}
        {currentStep < 5 && (
          <div className="mb-8">
            <div className="flex justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
                style={{ width: `${((currentStep - 1) / (steps.length - 2)) * 100}%` }}
              />
              
              {steps.slice(0, 4).map(step => (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    currentStep >= step.id 
                    ? "bg-primary text-white shadow-lg shadow-primary/25 scale-110" 
                    : "bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400"
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    currentStep >= step.id ? "text-primary" : "text-slate-400"
                  }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Card className="border-none shadow-2xl">
          <CardHeader>
            {currentStep < 5 ? (
              <>
                <CardTitle className="text-2xl font-display font-bold">
                  {currentStep === 1 && "Create Your Account"}
                  {currentStep === 2 && "Setup Your Cafe"}
                  {currentStep === 3 && "Brand Your Business"}
                  {currentStep === 4 && "Choose Your Plan"}
                </CardTitle>
                <CardDescription>
                  Step {currentStep} of 4 — {steps[currentStep - 1].title}
                </CardDescription>
              </>
            ) : (
              <div className="text-center">
                <CardTitle className="text-2xl font-display font-bold">Welcome Aboard!</CardTitle>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
          {currentStep < 5 && (
            <CardFooter className="flex justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={currentStep === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              {currentStep < 4 ? (
                <Button onClick={handleNext} className="gap-2 px-8">
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="gap-2 px-8 bg-green-600 hover:bg-green-700">
                  Complete Registration <CheckCircle2 className="h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
            <ArrowLeft className="h-3 w-3" /> Back to CloudCafe Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegistrationFlow;
