"use client";

import { MealCard } from "@/components/meals/meal-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

// Mock data for meals page (will be replaced by API)
const ALL_MEALS = [
    {
        id: "1",
        name: "Classic Cheeseburger",
        description: "Juicy beef patty with cheddar cheese, lettuce, and tomato on a brioche bun.",
        price: 350,
        rating: 4.8,
        reviews: 120,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        category: "Burgers",
        provider: "Burger King"
    },
    {
        id: "2",
        name: "Margherita Pizza",
        description: "Fresh basil, mozzarella cheese, and tomato sauce on a thin crust.",
        price: 650,
        rating: 4.6,
        reviews: 85,
        image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80",
        category: "Italian",
        provider: "Pizza Hut"
    },
    {
        id: "3",
        name: "Chicken Teriyaki Bowl",
        description: "Grilled chicken glazed with teriyaki sauce, served over steamed rice and vegetables.",
        price: 420,
        rating: 4.7,
        reviews: 200,
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
        category: "Asian",
        provider: "Panda Express"
    },
    {
        id: "4",
        name: "Kacchi Biriyani",
        description: "Traditional Bangladeshi aromatic rice dish with tender mutton pieces and potatoes.",
        price: 480,
        rating: 4.9,
        reviews: 245,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80",
        category: "Asian",
        provider: "Sultan's Dine"
    },
    {
        id: "5",
        name: "Spicy Beef Curry",
        description: "Tender beef cooked in a rich, spicy gravy with traditional spices.",
        price: 550,
        rating: 4.5,
        reviews: 90,
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80",
        category: "Asian",
        provider: "Spice House"
    },
    {
        id: "6",
        name: "Caesar Salad",
        description: "Crisp romaine lettuce, croutons, parmesan cheese, and caesar dressing.",
        price: 300,
        rating: 4.4,
        reviews: 65,
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&q=80",
        category: "Salads",
        provider: "Fresh Greens"
    },
    {
        id: "7",
        name: "Pasta Carbonara",
        description: "Spaghetti with creamy egg sauce, pancetta, and black pepper.",
        price: 450,
        rating: 4.7,
        reviews: 110,
        image: "https://images.unsplash.com/photo-1612874742237-98280d20748b?w=800&q=80",
        category: "Italian",
        provider: "Pasta Palace"
    },
    {
        id: "8",
        name: "Grilled Salmon",
        description: "Fresh salmon fillet grilled to perfection, served with asparagus.",
        price: 850,
        rating: 4.9,
        reviews: 150,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a7270028d?w=800&q=80",
        category: "Healthy",
        provider: "Ocean Delights"
    }
];

export default function MealsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Meals</h1>
                    <p className="text-muted-foreground">
                        Discover delicious local food from top-rated providers.
                    </p>
                </div>

                {/* Search and Filter placeholders (Commit 23 will expand this) */}
                <div className="flex w-full md:w-auto gap-3">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search meals..." className="pl-9" />
                    </div>
                    <Button variant="outline" size="icon">
                        <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ALL_MEALS.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                ))}
            </div>
        </div>
    );
}
