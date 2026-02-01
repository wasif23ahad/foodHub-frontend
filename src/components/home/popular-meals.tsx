"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
                        <Card key={meal.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-none shadow-sm">
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={meal.image}
                                    alt={meal.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white backdrop-blur-sm shadow-sm gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-xs">{meal.rating}</span>
                                </Badge>
                            </div>

                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="secondary" className="text-xs font-normal text-muted-foreground bg-slate-100 hover:bg-slate-200">
                                        {meal.category}
                                    </Badge>
                                </div>
                                <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">
                                    {meal.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
                                    {meal.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>By <span className="font-medium text-foreground">{meal.provider}</span></span>
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0 flex items-center justify-between">
                                <span className="text-xl font-bold text-primary">
                                    ৳{meal.price}
                                </span>
                                <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 rounded-full h-8 w-8 p-0">
                                    <Plus className="h-4 w-4" />
                                    <span className="sr-only">Add to cart</span>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
