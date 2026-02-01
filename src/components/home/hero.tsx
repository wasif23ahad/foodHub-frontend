"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative bg-secondary py-20 px-4 md:py-32 overflow-hidden">
            {/* Background patterned overlay or image could go here */}
            <div className="absolute inset-0 bg-primary/5 pattern-grid-lg opacity-20" />

            <div className="container relative mx-auto flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                    Discover & Order <br />
                    <span className="text-primary">Delicious Meals</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
                    From local favorites to gourmet specialties, get the best food delivered fast to your doorstep.
                </p>

                {/* Search Bar */}
                <div className="w-full max-w-md flex gap-2 relative mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search for meals (e.g. Burger, Pizza)..."
                            className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus-visible:ring-primary"
                        />
                    </div>
                    <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary-dark">
                        Search
                    </Button>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-4">
                    <Link href="/meals">
                        <Button size="lg" className="rounded-full px-8 bg-white text-secondary hover:bg-gray-100">
                            Browse Menu
                        </Button>
                    </Link>
                    <Link href="/providers">
                        <Button size="lg" variant="outline" className="rounded-full px-8 border-white/20 text-white hover:bg-white/10">
                            Become a Provider
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
