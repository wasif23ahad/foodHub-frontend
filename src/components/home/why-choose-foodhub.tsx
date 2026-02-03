"use client";

import { Shield, Clock, Star, Truck } from "lucide-react";
import { motion, Variants } from "framer-motion";

const REASONS = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "Your data and payments are protected. Order with confidence.",
  },
  {
    icon: Clock,
    title: "Quick Delivery",
    description: "Fresh meals delivered to your door in 30–45 minutes.",
  },
  {
    icon: Star,
    title: "Top-Rated Providers",
    description: "Curated local kitchens and restaurants with real reviews.",
  },
  {
    icon: Truck,
    title: "Easy Ordering",
    description: "Browse, add to cart, and checkout in just a few taps.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Best food delivery experience. The biriyani was piping hot and delicious!",
    author: "Rahim, Dhaka",
  },
  {
    quote: "I run a small kitchen and FoodHub made it easy to reach more customers.",
    author: "Sultanic Biriyani",
  },
  {
    quote: "Fast, reliable, and the app is so easy to use. Highly recommend.",
    author: "Fatima, Chittagong",
  },
];

const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45 },
  },
};

export function WhyChooseFoodHub() {
  return (
    <section className="py-20 px-4 bg-slate-50/80 overflow-hidden">
      <div className="container mx-auto">
        {/* Why Choose FoodHub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold tracking-tight mb-3 text-foreground">
            Why Choose FoodHub
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We bring together the best local food and a seamless ordering experience.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {REASONS.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">
            What People Say
          </h2>
          <p className="text-muted-foreground text-sm">Real feedback from customers and providers.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.author}
              variants={itemVariants}
              className="p-6 rounded-xl bg-background border border-slate-200/80 shadow-sm"
            >
              <p className="text-foreground/90 italic mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-sm font-medium text-muted-foreground">— {t.author}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
