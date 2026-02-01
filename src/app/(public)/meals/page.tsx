"use client";

import { useQuery } from "@tanstack/react-query";
import { MealCard } from "@/components/meals/meal-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Meal, ApiResponse } from "@/types";

export default function MealsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["meals"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Meal[]>>("/meals");
            return res.data;
        },
    });

    const meals = data || [];

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

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-500">
                    Failed to load meals provided by backend.
                </div>
            ) : meals.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No meals found. Check back later!
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {meals.map((meal) => (
                        <MealCard key={meal.id} meal={meal} />
                    ))}
                </div>
            )}
        </div>
    );
}
