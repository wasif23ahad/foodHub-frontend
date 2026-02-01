"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MealCard } from "@/components/meals/meal-card";

// Mock data for initial display
const MOCK_MEALS = [
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
    }
];

export function PopularMeals() {
    return (
        <section className="py-20 px-4 bg-slate-50">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Popular Meals</h2>
                        <p className="text-muted-foreground">
                            The most ordered and highly rated meals from our providers.
                        </p>
                    </div>
                    <Link href="/meals">
                        <Button variant="outline" className="text-primary hover:text-primary-dark hover:bg-primary/5">
                            See All Meals
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_MEALS.map((meal) => (
                        <MealCard key={meal.id} meal={meal} />
                    ))}
                </div>
            </div>
        </section>
    );
}
