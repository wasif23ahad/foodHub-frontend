"use client";

import { useQuery } from "@tanstack/react-query";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { ApiResponse, Meal } from "@/types";
import { MealCard } from "@/components/meals/meal-card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export function PersonalizedMeals() {
  const { user } = useAuth();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["personalized-recommendations"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Meal[]>>("/ai/recommendations/personalized");
      return res.data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (!user || (!isLoading && (!recommendations || recommendations.length === 0))) {
    return null;
  }

  return (
    <section className="py-20 bg-slate-50/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest"
            >
              <Sparkles className="h-4 w-4" />
              Smart Recommendations
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Personalized <span className="text-primary">For You</span>
            </h2>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Based on your taste profile and order history, we think you'll love these delicious options.
            </p>
          </div>

          <Link href="/meals">
            <Button variant="ghost" className="group text-primary font-bold hover:bg-primary/5 rounded-2xl h-14 px-8">
              Explore More
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[450px] w-full bg-slate-200 animate-pulse rounded-[2.5rem]" />
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
      </div>
    </section>
  );
}
