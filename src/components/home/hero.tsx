"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

const containerVariants: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};

export function Hero() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/meals?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push("/meals");
        }
    };

    return (
        <section className="relative bg-[#DC2626] py-20 px-4 md:py-32 overflow-hidden">
            {/* Background patterned overlay and gradient curve */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 -right-24 h-48 bg-white/5 rounded-[50%] blur-3xl" />

            <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="container relative mx-auto flex flex-col items-center text-center z-10"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 drop-shadow-sm"
                >
                    Discover & Order <br />
                    <span>Delicious Meals</span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 font-medium"
                >
                    Gourmet flavors delivered to your doorstep. Choose from top-rated local providers and experience food like never before.
                </motion.p>

                {/* Search Bar - Dark Themed */}
                <motion.form
                    variants={itemVariants}
                    onSubmit={handleSearch}
                    className="w-full max-w-xl flex gap-2 relative mb-8 p-1 bg-slate-900/30 backdrop-blur-sm rounded-xl border border-white/10"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="What are you craving?"
                            className="pl-12 h-14 bg-slate-900 border-none text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-lg shadow-inner"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        className="h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-lg border border-white/5"
                    >
                        Search
                    </Button>
                </motion.form>

                <motion.div variants={itemVariants} className="flex gap-4">
                    <Link href="/meals">
                        <Button size="lg" className="rounded-full px-8 bg-white text-[#DC2626] hover:bg-slate-100 shadow-lg font-bold border-none transition-transform hover:scale-105 active:scale-95">
                            Browse Menu
                        </Button>
                    </Link>
                    <Link href="/providers">
                        <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-2 border-white text-white hover:bg-white/20 hover:text-white font-semibold backdrop-blur-sm transition-transform hover:scale-105 active:scale-95">
                            Become a Provider
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
