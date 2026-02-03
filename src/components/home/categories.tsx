"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Pizza, Coffee, Salad, Beef, Utensils, Soup, Carrot, UtensilsCrossed, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Category, ApiResponse } from "@/types";
import { motion, Variants } from "framer-motion";

// Mock data as fallback/icon mapping
const ICON_MAP: Record<string, any> = {
    "Italian": Pizza,
    "Asian": Soup,
    "Burgers": Beef,
    "Salads": Salad,
    "Coffee": Coffee,
    "Healthy": Carrot,
    "Breakfast": Coffee,
    "Deshi": Soup,     // Curry/Rice
    "Biriyani": Soup,  // Pot/Bowl
    "Kababs": Beef,    // Skewer/Meat
    "Naan": Pizza      // Flatbread
};



const containerVariants: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.4 }
    }
};

export function Categories() {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<Category[]>>("/categories");
            return res.data;
        },
        retry: 1,
    });

    const displayCategories = data || [];

    if (isLoading) {
        return (
            <section className="py-16 px-4 bg-background overflow-hidden">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <Skeleton className="h-10 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center justify-center p-6 border rounded-xl h-[180px]">
                                <Skeleton className="h-12 w-12 rounded-full mb-4" />
                                <Skeleton className="h-6 w-24 mb-2" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="py-16 px-4 bg-background overflow-hidden">
                <div className="container mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-amber-600 mb-4">
                        <AlertCircle className="h-7 w-7" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Couldn&apos;t load categories</h2>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                        The server may be temporarily unavailable. Please try again.
                    </p>
                    <Button variant="outline" onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            </section>
        );
    }

    if (displayCategories.length === 0 && !isLoading) {
        return null;
    }

    return (
        <section className="py-16 px-4 bg-background overflow-hidden">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Categories</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore our wide range of delicious meals from various cuisines.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                >
                    {displayCategories.map((category: any) => {
                        const Icon = ICON_MAP[category.name] || UtensilsCrossed;

                        return (
                            <motion.div key={category.id} variants={itemVariants}>
                                <Link href={`/meals?category=${category.id}`}>
                                    <Card className="flex flex-col items-center justify-center p-6 hover:border-primary hover:shadow-lg transition-all cursor-pointer group h-full hover:scale-105 active:scale-95 duration-300">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                            <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                                        <span className="text-sm text-muted-foreground">{category._count?.meals || 0} items</span>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
