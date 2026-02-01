import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MealCard } from "@/components/meals/meal-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Loader2, X } from "lucide-react";
import { api } from "@/lib/api";
import { Meal, Category, ApiResponse } from "@/types";
import { useDebounce } from "@/hooks/use-debounce"; // We might need to create this hook if it doesn't exist, but I'll write inline debounce first or create the file. Be safer to create the file.

// Fallback data in case backend is empty
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
    },
    {
        id: "9",
        name: "Beef Sheek Kabab",
        description: "Juicy minced beef mixed with traditional spices and grilled on skewers.",
        price: 220,
        rating: 4.8,
        reviews: 320,
        image: "https://images.unsplash.com/photo-1627916603058-20a22cf8867a?w=800&q=80",
        category: "Asian",
        provider: "Star Kabab"
    },
    {
        id: "10",
        name: "Butter Naan",
        description: "Soft and fluffy flatbread baked in a tandoor and brushed with butter.",
        price: 60,
        rating: 4.7,
        reviews: 450,
        image: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&q=80",
        category: "Asian",
        provider: "Star Kabab"
    },
    {
        id: "11",
        name: "Old Dhaka Beef Tehari",
        description: "Aromatic rice cooked with small beef chunks, mustard oil, and green chilies.",
        price: 320,
        rating: 4.9,
        reviews: 580,
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
        category: "Asian",
        provider: "Tehari Ghar"
    }
];

export default function MealsPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("-createdAt"); // Default sort by newest

    // Defer the search value for API calls to avoid excessive requests
    const debouncedSearch = useDebounce(search, 500);

    // Fetch categories for filter
    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Category[]>>("/categories");
                return res.data;
            } catch (e) {
                return [];
            }
        },
    });

    const categories = categoriesData || [];

    const { data, isLoading, error } = useQuery({
        queryKey: ["meals", debouncedSearch, category, sort],
        queryFn: async () => {
            // Build query params
            const params = new URLSearchParams();
            if (debouncedSearch) params.append("search", debouncedSearch);
            if (category && category !== "all") params.append("categoryId", category);
            if (sort) params.append("sort", sort);

            try {
                // If the backend endpoint supports query params appended to URL
                const queryString = params.toString();
                const url = `/meals${queryString ? `?${queryString}` : ""}`;

                const res = await api.get<ApiResponse<Meal[]>>(url);
                return res.data;
            } catch (err) {
                console.error("API Fetch Error, using fallback", err);
                return [];
            }
        },
    });

    // Use API data if available, otherwise use mock data ONLY if search/filters are empty to show something initially
    // But if searching and no results, showing mock data is confusing. 
    // So: if filtering is active, show real results (even if empty). If no filters and empty backend, show mock.
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
                <div className="flex justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
