"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MealCard } from "@/components/meals/meal-card";
import { api } from "@/lib/api";
import { Meal, ApiResponse } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { motion, Variants } from "framer-motion";

export function PopularMeals() {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["popular-meals"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Meal[]>>("/meals?limit=4");
            return res.data;
        },
        retry: 1,
    });

    const meals = data || [];

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
                ) : isError ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-600 mb-4">
                            <AlertCircle className="h-7 w-7" />
                        </div>
                        <p className="text-muted-foreground mb-4">Couldn&apos;t load popular meals. The server may be temporarily unavailable.</p>
                        <Button variant="outline" onClick={() => refetch()}>Try again</Button>
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
