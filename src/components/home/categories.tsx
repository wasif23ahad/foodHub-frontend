"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Pizza, Coffee, Salad, Beef, Utensils, Soup, Carrot, UtensilsCrossed } from "lucide-react";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Category, ApiResponse } from "@/types";

// Mock data as fallback/icon mapping
const ICON_MAP: Record<string, any> = {
    "Italian": Pizza,
    "Asian": Soup,
    "Burgers": Beef,
    "Salads": Salad,
    "Coffee": Coffee,
    "Healthy": Carrot,
    "Breakfast": Coffee
};

const DEFAULT_CATEGORIES = [
    { id: "italian", name: "Italian", count: 12 },
    { id: "asian", name: "Asian", count: 8 },
    { id: "burgers", name: "Burgers", count: 15 },
    { id: "healthy", name: "Healthy", count: 6 },
    { id: "breakfast", name: "Breakfast", count: 9 },
    { id: "all", name: "View All", count: 42 },
];

export function Categories() {
    const { data } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Category[]>>("/categories");
                return res.data;
            } catch (e) {
                console.error("Failed to fetch categories, using fallback");
                return [];
            }
        },
    });

    // Use backend data if available, otherwise default
    const displayCategories = data && data.length > 0 ? data : DEFAULT_CATEGORIES;

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
                    {displayCategories.map((category: any) => {
                        const Icon = ICON_MAP[category.name] || UtensilsCrossed;

                        return (
                            <Link key={category.id} href={`/meals?category=${category.name}`}>
                                <Card className="flex flex-col items-center justify-center p-6 hover:border-primary hover:shadow-md transition-all cursor-pointer group h-full">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                        <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                                    <span className="text-sm text-muted-foreground">{category.count || "20+"} items</span>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
