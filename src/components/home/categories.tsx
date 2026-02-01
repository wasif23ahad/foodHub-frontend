"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Pizza, Coffee, Salad, Beef, Utensils, Soup, Carrot, UtensilsCrossed } from "lucide-react";
import { Card } from "@/components/ui/card";
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
    const { data } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Category[]>>("/categories");
                return res.data;
            } catch (e) {
                console.error("Failed to fetch categories, using fallback");
                return [];
            }
        },
    });

    const displayCategories = data || [];

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
