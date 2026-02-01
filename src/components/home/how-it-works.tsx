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

export function HowItWorks() {
    return (
        <section className="py-24 px-4 bg-background">
            <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">How It Works</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
                    Ordering your favorite food has never been easier. Just follow these simple steps.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-100 -z-10" />

                    {STEPS.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-sm border border-primary/10">
                                <step.icon className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed max-w-xs">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
