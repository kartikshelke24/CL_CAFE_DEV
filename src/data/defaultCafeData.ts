export const defaultCategories = [
  { id: "cat_1", name: "Hot Coffee", icon: "☕" },
  { id: "cat_2", name: "Cold Brews", icon: "🥤" },
  { id: "cat_3", name: "Pastries", icon: "🥐" },
  { id: "cat_4", name: "Breakfast", icon: "🍳" }
];

export const defaultMenuItems = [
  {
    id: "item_1",
    name: "Classic Espresso",
    description: "Rich and bold single shot of our signature roast.",
    price: 120,
    category: "cat_1",
    image: "https://images.unsplash.com/photo-1510707577719-af7c183f10ad?q=80&w=1974&auto=format&fit=crop",
    rating: 4.8,
    popular: true
  },
  {
    id: "item_2",
    name: "Caramel Macchiato",
    description: "Espresso with steamed milk and sweet caramel syrup.",
    price: 180,
    category: "cat_1",
    image: "https://images.unsplash.com/photo-1485808191679-5f63bb006095?q=80&w=1974&auto=format&fit=crop",
    rating: 4.9,
    popular: true
  },
  {
    id: "item_3",
    name: "Iced Americano",
    description: "Signature espresso over ice with chilled water.",
    price: 140,
    category: "cat_2",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1974&auto=format&fit=crop",
    rating: 4.5,
    popular: false
  }
];

export const defaultTables = [
  { id: "table_1", name: "1", capacity: 2, shape: "square", status: "available" },
  { id: "table_2", name: "2", capacity: 4, shape: "round", status: "available" },
  { id: "table_3", name: "3", capacity: 4, shape: "square", status: "available" },
  { id: "table_4", name: "4", capacity: 6, shape: "square", status: "available" }
];
