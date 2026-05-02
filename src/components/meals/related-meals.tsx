"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Meal, ApiResponse } from "@/types";
import { MealCard } from "@/components/meals/meal-card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function RelatedMeals({ mealId }: { mealId: string }) {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["related-meals", mealId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Meal[]>>(`/ai/recommendations/related/${mealId}`);
      return res.data;
    },
    enabled: !!mealId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (!isLoading && (!recommendations || recommendations.length === 0)) {
    return null;
  }

  return (
    <section className="mt-20 pt-12 border-t">
      <div className="flex flex-col gap-2 mb-10">
        <div className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-[0.2em]">
          <Sparkles className="h-4 w-4" />
          Semantic Match
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Similar <span className="text-primary">Gourmet</span> Delights
        </h2>
        <p className="text-slate-500 font-medium italic">
          If you liked this, we're confident you'll enjoy these too.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[450px] w-full bg-slate-100 animate-pulse rounded-[2.5rem]" />
          ))
        ) : (
          recommendations?.map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <MealCard meal={meal} />
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
