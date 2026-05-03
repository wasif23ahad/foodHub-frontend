"use client";

import { useQuery } from "@tanstack/react-query";
import { Heart, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MealCard } from "@/components/meals/meal-card";
import { MealSkeleton } from "@/components/meals/meal-skeleton";
import { useFavoritesStore } from "@/stores/favorites-store";
import { api } from "@/lib/api";
import { ApiResponse, Meal } from "@/types";

export default function FavoritesPage() {
  const mealIds = useFavoritesStore((s) => s.mealIds);
  const [search, setSearch] = useState("");

  const { data: meals, isLoading } = useQuery({
    queryKey: ["favorites", mealIds],
    queryFn: async () => {
      if (mealIds.length === 0) return [];
      // Fetch each meal in parallel — small list, no bulk endpoint needed
      const results = await Promise.allSettled(
        mealIds.map((id) => api.get<ApiResponse<any>>(`/meals/${id}`).then((r) => r.data.data))
      );
      return results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
        .map((r) => r.value);
    },
    enabled: mealIds.length > 0,
  });

  const filtered = (meals ?? []).filter((m) =>
    !search || m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">My Favorites</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">
            Meals you've saved for later.
          </p>
        </div>
        {mealIds.length > 0 && (
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search favorites..."
              className="pl-12 h-12 bg-card border-border border-2 rounded-2xl focus:border-primary/20 focus:ring-primary/10 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Body */}
      {mealIds.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Tap the heart on any meal to save it here. Build a list of your go-to dishes for one-tap reordering."
          action={{ label: "Browse Meals", href: "/meals" }}
        />
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <MealSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matches found"
          description={`We couldn't find any favorites matching "${search}".`}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((meal) => <MealCard key={meal.id} meal={meal} />)}
        </div>
      )}
    </div>
  );
}
