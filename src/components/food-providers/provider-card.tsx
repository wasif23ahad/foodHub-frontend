"use client";

import Link from "next/link";
import { Star, MapPin, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Provider } from "@/types";
import { motion } from "framer-motion";

interface ProviderCardProps {
    provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
    return (
        <Link href={`/providers/${provider.id}`}>
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
            >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                    <CardHeader className="p-0">
                        <div className="relative aspect-video w-full overflow-hidden bg-muted">
                            {provider.logo ? (
                                <img
                                    src={provider.logo}
                                    alt={provider.businessName}
                                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary/10">
                                    <Utensils className="h-12 w-12 text-primary/40" />
                                </div>
                            )}
                            <Badge className="absolute top-3 right-3 bg-white/90 text-primary hover:bg-white flex items-center gap-1 font-bold">
                                <Star className="h-3 w-3 fill-primary text-primary" />
                                {(provider.rating || provider.avgRating || 4.5).toFixed(1)}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-xl line-clamp-1">{provider.businessName}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                            {provider.description || "Authentic local flavors delivered to your doorstep."}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {provider.cuisineType && (
                                <div className="flex items-center gap-1">
                                    <Utensils className="h-4 w-4" />
                                    <span>{provider.cuisineType}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>Local</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-5 pt-0 mt-auto border-t border-border/40 bg-muted/30">
                        <div className="w-full flex justify-between items-center mt-4">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {provider.totalReviews ? `${provider.totalReviews}+ Reviews` : "New Provider"}
                            </span>
                            <span className="text-primary font-semibold text-sm">View Menu &rarr;</span>
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </Link>
    );
}
