"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MealCard } from "@/components/meals/meal-card";
import { api } from "@/lib/api";
import { Meal, ApiResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_MEALS } from "@/lib/constants";

import { motion, Variants } from "framer-motion";

export function PopularMeals() {
    const { data, isLoading } = useQuery({
        queryKey: ["popular-meals"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Meal[]>>("/meals?limit=4");
                return res.data;
            } catch (err) {
                console.error("Popular meals fetch failed:", err);
                return [];
            }
        },
    });

    // Specific meals requested: Classic Cheeseburger (1), Kacchi Biriyani (4), Beef Sheek Kabab (9), Chicken Teriyaki Bowl (3)
    const fallbackMeals = MOCK_MEALS.filter(meal => ["1", "3", "4", "9"].includes(meal.id));
    const meals = data && data.length > 0 ? data : fallbackMeals;

    const containerVariants: Variants = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        initial: { opacity: 0, y: 30 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section className="py-20 px-4 bg-slate-50 overflow-hidden">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4"
                >
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Popular Meals</h2>
                        <p className="text-muted-foreground">
                            The most ordered and highly rated meals from our providers.
                        </p>
                    </div>
                    <Link href="/meals">
                        <Button variant="outline" className="text-primary hover:text-white hover:bg-primary transition-all duration-300">
                            See All Meals
                        </Button>
                    </Link>
                </motion.div>

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
                    <motion.div
                        variants={containerVariants}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {meals.slice(0, 4).map((meal) => (
                            <motion.div key={meal.id} variants={itemVariants}>
                                <MealCard meal={meal} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
