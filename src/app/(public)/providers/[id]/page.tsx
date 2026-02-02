"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Provider, Meal, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Phone, Mail, ArrowLeft, Utensils, Info } from "lucide-react";
import { MealCard } from "@/components/meals/meal-card";
import { motion } from "framer-motion";
import { getMediaUrl } from "@/lib/utils";

export default function ProviderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const providerId = params?.id as string;

    const { data: provider, isLoading, error } = useQuery({
        queryKey: ["provider", providerId],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Provider>>(`/providers/${providerId}`);
                return res.data;
            } catch (err) {
                console.error("Fetch provider error:", err);
                throw err;
            }
        },
        enabled: !!providerId,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-8 w-32 mb-8" />
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        <Skeleton className="h-64 w-full rounded-2xl" />
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-10 w-48" />
                        <div className="grid sm:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-80 w-full" />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!provider || error) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Provider not found</h2>
                <Button onClick={() => router.push("/providers")}>Back to Providers</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                className="mb-6 group hover:bg-transparent hover:text-primary p-0"
                onClick={() => router.push("/providers")}
            >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to All Kitchens
            </Button>

            <div className="grid lg:grid-cols-3 gap-12 items-start">
                {/* Provider Info Sidebar */}
                <div className="lg:col-span-1 space-y-8 sticky top-24">
                    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-muted">
                        {provider.logo ? (
                            <img
                                src={getMediaUrl(provider.logo)}
                                alt={provider.businessName}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-primary/5">
                                <Utensils className="h-20 w-20 text-primary/20" />
                            </div>
                        )}
                        <div className="absolute top-4 right-4">
                            <Badge className="bg-white/95 text-primary text-lg px-3 py-1.5 shadow-sm font-bold flex items-center gap-1.5 backdrop-blur-sm">
                                <Star className="h-5 w-5 fill-primary text-primary" />
                                {provider.avgRating?.toFixed(1)}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-extrabold mb-2">{provider.businessName}</h1>
                            {provider.cuisineType && (
                                <Badge variant="outline" className="text-sm font-medium border-primary/20 text-primary bg-primary/5">
                                    {provider.cuisineType}
                                </Badge>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                About this Kitchen
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {provider.description || "Freshly prepared home-style meals delivered from our kitchen to your table. We pride ourselves on using authentic ingredients and traditional recipes."}
                            </p>
                        </div>

                        <Separator className="opacity-50" />

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold">Contact Info</h3>
                            <div className="space-y-3">
                                {provider.address && (
                                    <div className="flex items-start gap-3 text-muted-foreground group">
                                        <MapPin className="h-5 w-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
                                        <span className="text-sm">{provider.address}</span>
                                    </div>
                                )}
                                {provider.phone && (
                                    <div className="flex items-center gap-3 text-muted-foreground group">
                                        <Phone className="h-5 w-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
                                        <span className="text-sm">{provider.phone}</span>
                                    </div>
                                )}
                                {provider.contactEmail && (
                                    <div className="flex items-center gap-3 text-muted-foreground group">
                                        <Mail className="h-5 w-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
                                        <span className="text-sm">{provider.contactEmail}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meals Grid */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-8 border-b border-border/40 pb-4">
                        <h2 className="text-2xl font-bold">Menu</h2>
                        <Badge variant="secondary" className="font-semibold px-3 py-1">
                            {provider.meals?.length || 0} Items
                        </Badge>
                    </div>

                    {!provider.meals || provider.meals.length === 0 ? (
                        <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                            <Utensils className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground font-medium">No meals available at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-6 pb-20">
                            {provider.meals.map((meal) => (
                                <motion.div
                                    key={meal.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <MealCard meal={meal} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
