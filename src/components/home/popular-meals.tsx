"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MealCard } from "@/components/meals/meal-card";
import { api } from "@/lib/api";
import { Meal, ApiResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function PopularMeals() {
    const { data, isLoading } = useQuery({
        queryKey: ["popular-meals"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Meal[]>>("/meals?limit=4&sort=-rating"); // Assuming backend supports these params
            return res.data;
        },
    });

    const meals = data || [];

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

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-[350px] rounded-xl overflow-hidden">
                                <Skeleton className="h-48 w-full" />
                                <div className="p-4 space-y-3">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {meals.slice(0, 4).map((meal) => (
                            <MealCard key={meal.id} meal={meal} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
