"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Meal } from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { getMediaUrl } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MealCardProps {
    meal: Meal | any;
}

export function MealCard({ meal }: MealCardProps) {
    const { addItem, checkProviderConsistency, clearCart } = useCartStore();
    const [imgSrc, setImgSrc] = useState(getMediaUrl(meal.image) || "/placeholder-meal.jpg");
    const [showConflictDialog, setShowConflictDialog] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!checkProviderConsistency(meal)) {
            setShowConflictDialog(true);
            return;
        }

        addItem(meal);
        toast.success(`Added ${meal.name} to cart`);
    };

    const handleConfirmClear = () => {
        clearCart();
        addItem(meal);
        toast.success(`Cart cleared and ${meal.name} added`);
        setShowConflictDialog(false);
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
            >
                <Card className="overflow-hidden group transition-shadow duration-300 border-none shadow-sm h-full flex flex-col hover:shadow-xl">
                    <Link href={`/meals/${meal.id}`} className="overflow-hidden flex-1 flex flex-col">
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                            <Image
                                src={imgSrc}
                                alt={meal.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                onError={() => setImgSrc("/placeholder-meal.jpg")}
                            />
                            <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white backdrop-blur-sm shadow-sm gap-1 z-10">
                                {meal.avgRating && meal.avgRating > 0 ? (
                                    <>
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold text-xs">{meal.avgRating.toFixed(1)}</span>
                                    </>
                                ) : (
                                    <span className="font-semibold text-xs text-primary">New</span>
                                )}
                            </Badge>
                        </div>

                        <CardContent className="p-4 flex-1">
                            <div className="flex justify-between items-start mb-2 gap-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs font-normal text-muted-foreground bg-slate-100 hover:bg-slate-200">
                                    {meal.category?.name || "Meal"}
                                </Badge>
                                {meal.dietaryPreference && meal.dietaryPreference !== "REGULAR" && (
                                    <Badge variant="outline" className="text-xs font-medium border-primary/20 bg-primary/5 text-primary">
                                        {meal.dietaryPreference.replace("_", " ")}
                                    </Badge>
                                )}
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
                            onClick={handleAddToCart}
                        >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add to cart</span>
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>

            <AlertDialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change Restaurant?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your cart currently contains items from another provider. You can only order from one restaurant at a time.
                            Do you want to clear your cart and add this item?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmClear}>
                            Clear Cart & Add
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
