"use client";

import { Search, CreditCard, Truck } from "lucide-react";

const STEPS = [
    {
        icon: Search,
        title: "1. Browse Meals",
        description: "Explore a wide variety of cuisines and dishes from top-rated local providers near you.",
    },
    {
        icon: CreditCard,
        title: "2. Secure Order",
        description: "Add your favorite meals to the cart and pay securely using our integrated payment system.",
    },
    {
        icon: Truck,
        title: "3. Fast Delivery",
        description: "Sit back and relax while our delivery partners bring your fresh, hot meal right to your doorstep.",
    },
];

import { motion, Variants } from "framer-motion";

export function HowItWorks() {
    const containerVariants: Variants = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        initial: { opacity: 0, scale: 0.9, y: 30 },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <section className="py-24 px-4 bg-background overflow-hidden">
            <div className="container mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">How It Works</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
                        Ordering your favorite food has never been easier. Just follow these simple steps.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
                >
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-100 -z-10" />

                    {STEPS.map((step, index) => (
                        <motion.div key={index} variants={itemVariants} className="flex flex-col items-center group">
                            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-sm border border-primary/10 transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary/20">
                                <step.icon className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
