"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Meal } from "@/types";
import { useCartStore } from "@/stores/cart-store";

interface MealCardProps {
    meal: Meal | any;
}

export function MealCard({ meal }: MealCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <motion.div
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            className="h-full"
        >
            <Card className="overflow-hidden group transition-shadow duration-300 border-none shadow-sm h-full flex flex-col hover:shadow-xl">
                <Link href={`/meals/${meal.id}`} className="block overflow-hidden flex-1 flex flex-col">
                    <div className="relative h-48 w-full overflow-hidden">
                        <Image
                            src={meal.image || "/placeholder-meal.jpg"}
                            alt={meal.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white backdrop-blur-sm shadow-sm gap-1 z-10">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-xs">{(meal.avgRating || 4.5).toFixed(1)}</span>
                        </Badge>
                    </div>

                    <CardContent className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary" className="text-xs font-normal text-muted-foreground bg-slate-100 hover:bg-slate-200">
                                {meal.category?.name || "Meal"}
                            </Badge>
                        </div>
                        <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">
                            {meal.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {meal.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>By <span className="font-medium text-foreground">{meal.providerProfile?.businessName || "Local Kitchen"}</span></span>
                        </div>
                    </CardContent>
                </Link>

                <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-primary">
                        ৳{meal.price}
                    </span>
                    <Button
                        size="sm"
                        className="bg-slate-900 text-white hover:bg-slate-800 rounded-full h-8 w-8 p-0"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(meal);
                            toast.success(`Added ${meal.name} to cart`);
                        }}
                    >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add to cart</span>
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
