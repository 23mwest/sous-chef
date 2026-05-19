import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePantry } from "@/hooks/usePantry";
import { PantryList } from "@/components/PantryList";
import { ScrollArea } from "@/components/ui/scroll-area";

const INGREDIENT_SUGGESTIONS = [
  "Butter", "Eggs", "Milk", "Flour", "Sugar", "Salt", "Pepper", "Olive Oil",
  "Vegetable Oil", "Garlic", "Onion", "Tomatoes", "Pasta", "Rice", "Bread",
  "Chicken Broth", "Beef Broth", "Vegetable Broth", "Canned Tomatoes", "Tomato Paste",
  "Lemon", "Lime", "Vinegar", "Soy Sauce", "Hot Sauce", "Honey", "Baking Powder",
  "Baking Soda", "Cornstarch", "Oats", "Quinoa", "Lentils", "Chickpeas", "Black Beans",
  "Canned Tuna", "Coconut Milk", "Heavy Cream", "Parmesan", "Cheddar", "Mozzarella",
  "Greek Yogurt", "Spinach", "Broccoli", "Carrots", "Potatoes", "Sweet Potatoes",
  "Bell Peppers", "Ginger", "Cumin", "Paprika", "Oregano", "Basil", "Thyme",
  "Rosemary", "Cinnamon", "Vanilla Extract", "Chocolate Chips", "Cocoa Powder",
  "Peanut Butter", "Almonds", "Walnuts",
];

const COOKWARE_SUGGESTIONS = [
  "Instant Pot", "Air Fryer", "Cast Iron Skillet", "Dutch Oven", "Wok", "Stock Pot",
  "Sauce Pan", "Non-stick Pan", "Sheet Pan", "Baking Dish", "Muffin Tin", "Loaf Pan",
  "Slow Cooker", "Rice Cooker", "Pressure Cooker", "Stand Mixer", "Food Processor",
  "Blender", "Immersion Blender", "Toaster Oven", "Grill Pan", "Steamer Basket",
  "Roasting Pan", "Casserole Dish", "Pizza Stone", "Mortar and Pestle", "Rolling Pin",
  "Colander", "Salad Spinner", "Cutting Board",
];

export function PantryPage() {
  const { pantry, addIngredient, removeIngredient, addCookware, removeCookware } =
    usePantry();

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <header className="flex items-center gap-3 border-b px-4 py-3 bg-background">
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to chat"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-semibold text-sm">My Pantry</h1>
      </header>

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="flex flex-col gap-8">
          <PantryList
            title="Ingredients"
            items={pantry.ingredients}
            onAdd={addIngredient}
            onRemove={removeIngredient}
            placeholder="eggs, cheddar, olive oil..."
            suggestions={INGREDIENT_SUGGESTIONS}
          />
          <PantryList
            title="Cookware"
            items={pantry.cookware}
            onAdd={addCookware}
            onRemove={removeCookware}
            placeholder="cast iron skillet, instant pot..."
            suggestions={COOKWARE_SUGGESTIONS}
          />
        </div>
      </ScrollArea>

      <footer className="border-t px-4 py-3 text-xs text-muted-foreground text-center">
        Changes save automatically. Your pantry resets if you clear your browser data.
      </footer>
    </div>
  );
}
