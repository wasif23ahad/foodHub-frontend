"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse, Meal } from "@/types";
import { ShoppingBag, Star, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

interface MealCitationProps {
  id: string;
}

export function MealCitation({ id }: MealCitationProps) {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["meal-citation", id],
    queryFn: () => api.get<ApiResponse<Meal>>(`/meals/${id}`),
    staleTime: 5 * 60 * 1000,
  });

  const meal = response?.data;

  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700 mx-1 align-middle">
        <Loader2 className="h-3 w-3 animate-spin text-primary" />
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Checking...</span>
      </span>
    );
  }

  if (error || !meal) {
    return null; // Don't show anything if meal not found or error
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-block mx-1 align-middle"
    >
      <div className="group relative inline-flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
        <div className="relative h-8 w-8 rounded-xl overflow-hidden flex-shrink-0">
          <Image 
            src={meal.image || "/placeholder-meal.jpg"} 
            alt={meal.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black truncate max-w-[120px] leading-tight">{meal.name}</span>
            <div className="flex items-center gap-0.5 bg-amber-500/10 px-1 rounded-md">
              <Star className="h-2 w-2 fill-amber-500 text-amber-500" />
              <span className="text-[8px] font-black text-amber-600">{meal.avgRating || 0}</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-primary tabular-nums leading-none">৳{meal.price}</span>
        </div>
        
        {/* Quick Add Button */}
        <Button
          size="icon"
          className="h-6 w-6 rounded-lg ml-1 bg-primary hover:bg-primary-dark shadow-sm shadow-primary/20 transition-transform active:scale-90"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Trigger add to cart
          }}
        >
          <Plus className="h-3 w-3 text-white" />
        </Button>
      </div>
    </motion.span>
  );
}
