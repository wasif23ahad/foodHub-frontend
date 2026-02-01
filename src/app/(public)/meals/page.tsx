"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MealCard } from "@/components/meals/meal-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Loader2, X } from "lucide-react";
import { api } from "@/lib/api";
import { Meal, Category, ApiResponse } from "@/types";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { MOCK_MEALS } from "@/lib/constants";
import { MealSkeleton } from "@/components/meals/meal-skeleton";

export default function MealsPage() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "";
    const initialSearch = searchParams.get("search") || "";

    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState(initialCategory);
    const [sort, setSort] = useState("-createdAt");

    const debouncedSearch = useDebounce(search, 500);

    // Fetch categories
    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Category[]>>("/categories");
                return res.data;
            } catch (e) {
                console.error("Categories fetch failed", e);
                return [];
            }
        },
    });

    const categories = categoriesData || [];

    const { data, isLoading, error } = useQuery({
        queryKey: ["meals", debouncedSearch, category, sort, categories.length],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append("search", debouncedSearch);

            if (category && category !== "all") {
                const matched = categories.find(c =>
                    c.id === category || c.name.toLowerCase() === category.toLowerCase()
                );

                if (matched) {
                    params.append("categoryId", matched.id);
                } else if (category.length > 20) {
                    // If it looks like a MongoID/UUID, send it
                    params.append("categoryId", category);
                } else {
                    console.warn("Invalid category identifier:", category);
                    // Don't append anything, falls back to all meals
                }
            }
            if (sort) params.append("sort", sort);

            try {
                const queryString = params.toString();
                const url = `/meals${queryString ? `?${queryString}` : ""}`;
                const res = await api.get<ApiResponse<Meal[]>>(url);
                return res.data;
            } catch (err: any) {
                console.error("Meals fetch failed", err);
                return [];
            }
        },
        enabled: !category || category === "all" || categories.length > 0,
    });

    const isFiltering = debouncedSearch || (category && category !== "all");
    const showMockFallback = !isFiltering && (!data || data.length === 0);
    const meals = showMockFallback ? MOCK_MEALS : (data || []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Meals</h1>
                    <p className="text-muted-foreground">
                        Discover delicious local food from top-rated providers.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search meals..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Filter - Native Select styled to match */}
                    <div className="relative w-full md:w-40">
                        <select
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categories.map((c: any) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>

                    {/* Sort Filter - Native Select */}
                    <div className="relative w-full md:w-40">
                        <select
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="-createdAt">Newest</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                            <option value="-rating">Top Rated</option>
                        </select>
                        <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <MealSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20 text-red-500">
                    Failed to load meals.
                </div>
            ) : meals.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">No meals found matching your criteria.</p>
                    <Button
                        variant="link"
                        onClick={() => {
                            setSearch("");
                            setCategory("");
                            setSort("-createdAt");
                        }}
                        className="mt-2 text-primary"
                    >
                        Clear all filters
                    </Button>
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
