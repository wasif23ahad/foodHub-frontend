"use client";

import { Pizza, Coffee, Salad, Beef, Utensils, Soup } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

const categories = [
    { id: "italian", name: "Italian", icon: Pizza, count: 12 },
    { id: "asian", name: "Asian", icon: Soup, count: 8 },
    { id: "burgers", name: "Burgers", icon: Beef, count: 15 },
    { id: "healthy", name: "Healthy", icon: Salad, count: 6 },
    { id: "breakfast", name: "Breakfast", icon: Coffee, count: 9 },
    { id: "all", name: "View All", icon: Utensils, count: 42 },
];

export function Categories() {
    return (
        <section className="py-16 px-4 bg-background">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Categories</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore our wide range of delicious meals from various cuisines.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((category) => (
                        <Link key={category.id} href={`/meals?category=${category.id}`}>
                            <Card className="flex flex-col items-center justify-center p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer group h-full">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                    <category.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                                <span className="text-sm text-muted-foreground">{category.count} items</span>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
