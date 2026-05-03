"use client";

import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/stores/favorites-store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FavoriteButtonProps {
  mealId: string;
  className?: string;
}

export function FavoriteButton({ mealId, className }: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(mealId));
  const toggle = useFavoritesStore((s) => s.toggle);

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(mealId);
      }}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-card/80 backdrop-blur-md shadow-lg border border-border/50 transition-colors duration-200",
        isFavorite ? "border-primary/20" : "hover:bg-card",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isFavorite ? "solid" : "outline"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all duration-300",
              isFavorite ? "fill-primary text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
            strokeWidth={isFavorite ? 0 : 2}
          />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
