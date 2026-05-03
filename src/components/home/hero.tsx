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
        <section className="relative bg-primary min-h-[60vh] lg:h-[70vh] flex items-center py-20 px-4 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary-dark),transparent)] opacity-60 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" 
            />

            <motion.div
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="container relative mx-auto flex flex-col items-center text-center z-10"
            >
                <motion.div
                    variants={itemVariants}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm mb-6"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                    </span>
                    Now Serving 50+ Local Kitchens
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-7xl font-black tracking-tight text-white mb-6 drop-shadow-xl"
                >
                    Order Your <span className="text-accent italic">Cravings</span> <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">With AI Intelligence</span>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-2xl text-white/90 max-w-2xl mb-10 font-medium leading-relaxed"
                >
                    Gourmet flavors meets AI-powered recommendations. Discover the best local providers curated just for your taste.
                </motion.p>

                {/* Search Bar - Glassmorphism */}
                <motion.form
                    variants={itemVariants}
                    onSubmit={handleSearch}
                    className="w-full max-w-2xl flex flex-col sm:flex-row gap-3 relative mb-10 p-2 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                        <Input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="What are you craving today?"
                            className="pl-12 h-16 bg-white/10 border-none text-white placeholder:text-white/60 focus-visible:ring-1 focus-visible:ring-accent rounded-xl text-lg"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        className="h-16 px-10 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Search Meals
                    </Button>
                </motion.form>

                <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
                    <Link href="/cravely">
                        <Button size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-slate-50 shadow-xl font-bold border-none h-14 text-lg">
                            Ask Cravely AI
                        </Button>
                    </Link>
                    <Link href="/meals">
                        <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent border-2 border-white text-white hover:bg-white/10 hover:text-white font-bold h-14 text-lg">
                            Browse All
                        </Button>
                    </Link>
                </motion.div>
                
                {/* Scroll Cue */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-[-5rem] left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-white/50"
                >
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll</span>
                    <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-0.5 h-8 bg-gradient-to-b from-white/50 to-transparent"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
