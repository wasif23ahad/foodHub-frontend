"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProviderCard } from "@/components/food-providers/provider-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, X, Store } from "lucide-react";
import { api } from "@/lib/api";
import { Provider, ApiResponse } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";
import { motion, AnimatePresence, Variants } from "framer-motion";

const gridVariants: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

const cardVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9 }
};

export default function ProvidersPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const { data: providers, isLoading, error } = useQuery({
        queryKey: ["providers", debouncedSearch],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append("search", debouncedSearch);

            try {
                const res = await api.get<ApiResponse<Provider[]>>(`/providers${params.toString() ? `?${params.toString()}` : ""}`);
                return res.data;
            } catch (err) {
                console.error("Providers fetch failed", err);
                return [];
            }
        },
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3 flex items-center justify-center md:justify-start gap-3">
                        <Store className="h-10 w-10 text-primary" />
                        Our <span className="text-primary">Food Hubs</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Discover the talented local chefs and restaurants behind your favorite meals.
                    </p>
                </div>

                <div className="w-full md:w-96">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Find a specific kitchen..."
                            className="pl-12 py-6 text-lg border-2 focus-visible:ring-primary h-14"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-12 border-b border-border/40 pb-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                    <span className="h-px w-8 bg-primary/40 block"></span>
                    Available Providers
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium animate-pulse">Loading amazing kitchens...</p>
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
                    <p className="text-red-500 font-bold text-xl mb-2">Something went wrong</p>
                    <p className="text-red-400">We couldn't reach our kitchens. Please try again later.</p>
                </div>
            ) : !providers || providers.length === 0 ? (
                <div className="text-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
                    <Store className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">No providers found</h2>
                    <p className="text-muted-foreground mb-8 text-lg">We couldn't find any kitchens matching "{search}"</p>
                    <Button
                        onClick={() => setSearch("")}
                        className="rounded-full px-8 py-6 h-auto text-lg"
                    >
                        See All Kitchens
                    </Button>
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    <motion.div
                        variants={gridVariants}
                        initial="initial"
                        animate="animate"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {providers.map((provider) => (
                            <motion.div
                                key={provider.id}
                                variants={cardVariants}
                                layout
                            >
                                <ProviderCard provider={provider} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
