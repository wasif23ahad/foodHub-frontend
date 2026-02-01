"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function Hero() {
    return (
        <section className="relative bg-[#DC2626] py-20 px-4 md:py-32 overflow-hidden">
            {/* Background patterned overlay and gradient curve */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 -right-24 h-48 bg-white/5 rounded-[50%] blur-3xl" />

            <div className="container relative mx-auto flex flex-col items-center text-center z-10">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 drop-shadow-sm">
                    Discover & Order <br />
                    <span>Delicious Meals</span>
                </h1>

                <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 font-medium">
                    Gourmet flavors delivered to your doorstep. Choose from top-rated local providers and experience food like never before.
                </p>

                {/* Search Bar - Dark Themed */}
                <div className="w-full max-w-xl flex gap-2 relative mb-8 p-1 bg-slate-900/30 backdrop-blur-sm rounded-xl border border-white/10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            type="search"
                            placeholder="What are you craving?"
                            className="pl-12 h-14 bg-slate-900 border-none text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg shadow-inner"
                        />
                    </div>
                    <Button size="lg" className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-lg border border-white/5">
                        Search
                    </Button>
                </div>

                {/* CTA Buttons - Hidden in this specific red banner view request? User said "rest portion remains same" but the screenshot didn't show them. I will keep them but style them to match red theme if visible, or maybe hide them if the user implies EXACT match. 
                   "rest portion remains same" -> implied functionality.
                   However, the provided screenshot did NOT show the 'Browse Menu' buttons.
                   But removing them breaks the flow. I will keep them but update styles to look good on Red.
                   White solid + Outline White.
                */}
                <div className="flex gap-4">
                    <Link href="/meals">
                        <Button size="lg" className="rounded-full px-8 bg-white text-[#DC2626] hover:bg-slate-100 shadow-lg font-bold border-none">
                            Browse Menu
                        </Button>
                    </Link>
                    <Link href="/providers">
                        <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-2 border-white text-white hover:bg-white/20 hover:text-white font-semibold backdrop-blur-sm">
                            Become a Provider
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
