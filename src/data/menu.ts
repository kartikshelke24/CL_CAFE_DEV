export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  popular: boolean;
  customizations: {
    sizes: { name: string; priceAdd: number }[];
    addOns: { name: string; price: number }[];
    sugarLevels: string[];
    iceLevels: string[];
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  { id: "coffee", name: "Coffee", icon: "☕", count: 8 },
  { id: "tea", name: "Tea", icon: "🍵", count: 5 },
  { id: "pastry", name: "Pastries", icon: "🥐", count: 6 },
  { id: "smoothie", name: "Smoothies", icon: "🥤", count: 4 },
  { id: "sandwich", name: "Sandwiches", icon: "🥪", count: 4 },
  { id: "dessert", name: "Desserts", icon: "🍰", count: 5 },
];

const defaultCustomizations = {
  sizes: [
    { name: "Small", priceAdd: 0 },
    { name: "Medium", priceAdd: 0.5 },
    { name: "Large", priceAdd: 1.0 },
  ],
  addOns: [
    { name: "Extra Shot", price: 0.75 },
    { name: "Whipped Cream", price: 0.5 },
    { name: "Oat Milk", price: 0.6 },
    { name: "Caramel Drizzle", price: 0.5 },
    { name: "Vanilla Syrup", price: 0.45 },
  ],
  sugarLevels: ["No Sugar", "Less Sugar", "Normal", "Extra Sweet"],
  iceLevels: ["No Ice", "Less Ice", "Normal", "Extra Ice"],
};

const foodCustomizations = {
  sizes: [{ name: "Regular", priceAdd: 0 }, { name: "Large", priceAdd: 2.0 }],
  addOns: [
    { name: "Extra Cheese", price: 1.0 },
    { name: "Avocado", price: 1.5 },
    { name: "Bacon", price: 1.25 },
  ],
  sugarLevels: [],
  iceLevels: [],
};

export const menuItems: MenuItem[] = [
  {
    id: "1", name: "Signature Espresso", description: "Rich double-shot espresso with velvety crema, crafted from single-origin Ethiopian beans.", price: 3.50,
    category: "coffee", image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600", rating: 4.8, reviews: 234, popular: true, customizations: defaultCustomizations,
  },
  {
    id: "2", name: "Caramel Macchiato", description: "Silky steamed milk layered with espresso and topped with buttery caramel drizzle.", price: 5.25,
    category: "coffee", image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600", rating: 4.9, reviews: 412, popular: true, customizations: defaultCustomizations,
  },
  {
    id: "3", name: "Cold Brew", description: "Slow-steeped for 20 hours, our cold brew delivers smooth, bold flavor with low acidity.", price: 4.75,
    category: "coffee", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600", rating: 4.7, reviews: 189, popular: true, customizations: defaultCustomizations,
  },
  {
    id: "4", name: "Vanilla Latte", description: "Creamy espresso with steamed milk and real Madagascar vanilla bean.", price: 5.00,
    category: "coffee", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600", rating: 4.6, reviews: 156, popular: false, customizations: defaultCustomizations,
  },
  {
    id: "5", name: "Mocha Delight", description: "Rich chocolate meets espresso, topped with whipped cream and cocoa dust.", price: 5.50,
    category: "coffee", image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600", rating: 4.8, reviews: 298, popular: true, customizations: defaultCustomizations,
  },
  {
    id: "6", name: "Cappuccino", description: "Classic Italian-style with equal parts espresso, steamed milk, and foam art.", price: 4.50,
    category: "coffee", image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=600", rating: 4.5, reviews: 178, popular: false, customizations: defaultCustomizations,
  },
  {
    id: "7", name: "Flat White", description: "Velvety microfoam poured over a double ristretto for a bold, smooth sip.", price: 4.75,
    category: "coffee", image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600", rating: 4.7, reviews: 145, popular: false, customizations: defaultCustomizations,
  },
  {
    id: "8", name: "Affogato", description: "A scoop of vanilla gelato drowned in a shot of hot espresso.", price: 5.75,
    category: "coffee", image: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=600", rating: 4.9, reviews: 210, popular: true, customizations: defaultCustomizations,
  },
  {
    id: "9", name: "Matcha Latte", description: "Ceremonial-grade Japanese matcha whisked with creamy oat milk.", price: 5.25,
    category: "tea", image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600", rating: 4.6, reviews: 167, popular: true, customizations: defaultCustomizations,
  },
  {
    id: "10", name: "Chai Latte", description: "Aromatic Indian spices steeped in black tea with steamed milk and honey.", price: 4.75,
    category: "tea", image: "https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?w=600", rating: 4.7, reviews: 198, popular: false, customizations: defaultCustomizations,
  },
  {
    id: "11", name: "Earl Grey", description: "Fragrant bergamot-infused black tea, served with a slice of lemon.", price: 3.50,
    category: "tea", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600", rating: 4.4, reviews: 89, popular: false, customizations: defaultCustomizations,
  },
  {
    id: "12", name: "Jasmine Green Tea", description: "Delicate jasmine-scented green tea leaves, light and refreshing.", price: 3.75,
    category: "tea", image: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600", rating: 4.5, reviews: 112, popular: false, customizations: defaultCustomizations,
  },
  {
    id: "13", name: "Oolong Tea", description: "Semi-oxidized artisan oolong with floral notes and a smooth finish.", price: 4.00,
    category: "tea", image: "https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=600", rating: 4.3, reviews: 67, popular: false, customizations: defaultCustomizations,
  },
  {
    id: "14", name: "Butter Croissant", description: "Flaky, golden French croissant made with premium European butter.", price: 3.75,
    category: "pastry", image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=600", rating: 4.8, reviews: 321, popular: true, customizations: foodCustomizations,
  },
  {
    id: "15", name: "Blueberry Muffin", description: "Moist, tender muffin bursting with fresh blueberries and a crumb topping.", price: 3.50,
    category: "pastry", image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600", rating: 4.6, reviews: 187, popular: false, customizations: foodCustomizations,
  },
  {
    id: "16", name: "Cinnamon Roll", description: "Warm, gooey cinnamon roll with cream cheese frosting.", price: 4.25,
    category: "pastry", image: "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=600", rating: 4.9, reviews: 256, popular: true, customizations: foodCustomizations,
  },
  {
    id: "17", name: "Pain au Chocolat", description: "Buttery pastry filled with rich dark chocolate batons.", price: 4.00,
    category: "pastry", image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600", rating: 4.7, reviews: 198, popular: false, customizations: foodCustomizations,
  },
  {
    id: "18", name: "Almond Danish", description: "Flaky Danish pastry filled with almond cream and topped with sliced almonds.", price: 4.25,
    category: "pastry", image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600", rating: 4.5, reviews: 134, popular: false, customizations: foodCustomizations,
  },
  {
    id: "19", name: "Banana Bread", description: "Moist, homestyle banana bread with walnuts and a hint of cinnamon.", price: 3.75,
    category: "pastry", image: "https://images.unsplash.com/photo-1605090930601-82a18b87a9d8?w=600", rating: 4.6, reviews: 167, popular: false, customizations: foodCustomizations,
  },
  {
    id: "20", name: "Mango Tango", description: "Tropical blend of fresh mango, banana, and coconut milk.", price: 6.25,
    category: "smoothie", image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600", rating: 4.7, reviews: 145, popular: true, customizations: defaultCustomizations,
  },
  {
    id: "21", name: "Berry Blast", description: "Mixed berries blended with Greek yogurt and a drizzle of honey.", price: 6.50,
    category: "smoothie", image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600", rating: 4.8, reviews: 178, popular: true, customizations: defaultCustomizations,
  },
  {
    id: "22", name: "Green Goddess", description: "Spinach, kale, banana, and almond butter power smoothie.", price: 6.75,
    category: "smoothie", image: "https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=600", rating: 4.5, reviews: 98, popular: false, customizations: defaultCustomizations,
  },
  {
    id: "23", name: "Açaí Bowl", description: "Thick açaí smoothie topped with granola, fresh fruits, and honey.", price: 8.50,
    category: "smoothie", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600", rating: 4.9, reviews: 289, popular: true, customizations: foodCustomizations,
  },
  {
    id: "24", name: "Avocado Toast", description: "Smashed avocado on sourdough with cherry tomatoes, microgreens, and everything seasoning.", price: 8.75,
    category: "sandwich", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600", rating: 4.7, reviews: 234, popular: true, customizations: foodCustomizations,
  },
  {
    id: "25", name: "Caprese Panini", description: "Fresh mozzarella, tomato, and basil pesto pressed on ciabatta.", price: 9.25,
    category: "sandwich", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600", rating: 4.6, reviews: 156, popular: false, customizations: foodCustomizations,
  },
  {
    id: "26", name: "Turkey Club", description: "Roasted turkey, bacon, lettuce, tomato on toasted sourdough with herb aioli.", price: 10.50,
    category: "sandwich", image: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=600", rating: 4.8, reviews: 198, popular: true, customizations: foodCustomizations,
  },
  {
    id: "27", name: "Grilled Veggie Wrap", description: "Grilled zucchini, peppers, hummus, and feta in a spinach tortilla.", price: 8.50,
    category: "sandwich", image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600", rating: 4.5, reviews: 112, popular: false, customizations: foodCustomizations,
  },
  {
    id: "28", name: "Tiramisu", description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.", price: 7.50,
    category: "dessert", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600", rating: 4.9, reviews: 312, popular: true, customizations: foodCustomizations,
  },
  {
    id: "29", name: "Crème Brûlée", description: "Silky vanilla custard with a crisp caramelized sugar shell.", price: 7.00,
    category: "dessert", image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600", rating: 4.8, reviews: 245, popular: true, customizations: foodCustomizations,
  },
  {
    id: "30", name: "New York Cheesecake", description: "Dense, creamy cheesecake on a graham cracker crust with berry compote.", price: 6.75,
    category: "dessert", image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=600", rating: 4.7, reviews: 189, popular: false, customizations: foodCustomizations,
  },
  {
    id: "31", name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center, served with vanilla ice cream.", price: 8.25,
    category: "dessert", image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600", rating: 4.9, reviews: 278, popular: true, customizations: foodCustomizations,
  },
  {
    id: "32", name: "Macarons Assortment", description: "Six handcrafted French macarons in seasonal flavors.", price: 9.00,
    category: "dessert", image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600", rating: 4.6, reviews: 156, popular: false, customizations: foodCustomizations,
  },
];

export const testimonials = [
  { id: 1, name: "Sarah M.", text: "The best coffee I've had outside of Italy. The atmosphere is absolutely wonderful.", rating: 5, avatar: "SM" },
  { id: 2, name: "James K.", text: "Their cold brew is life-changing. I come here every single morning without fail.", rating: 5, avatar: "JK" },
  { id: 3, name: "Priya R.", text: "Beautiful space, incredible pastries, and the matcha latte is perfection.", rating: 5, avatar: "PR" },
  { id: 4, name: "David L.", text: "The tiramisu alone is worth the visit. Staff are friendly and knowledgeable.", rating: 4, avatar: "DL" },
];

export const coupons: Record<string, { discount: number; type: "percent" | "flat"; minOrder: number }> = {
  WELCOME10: { discount: 10, type: "percent", minOrder: 10 },
  COFFEE5: { discount: 5, type: "flat", minOrder: 15 },
  BREW20: { discount: 20, type: "percent", minOrder: 25 },
};
