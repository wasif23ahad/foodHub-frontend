"use client";

import { Shield, Clock, Star, Truck } from "lucide-react";
import { motion, Variants } from "framer-motion";

const REASONS = [
  {
    icon: Shield,
    title: "100% Secure Payments",
    description: "Industry-standard encryption for all your transactions. Your security is our top priority.",
  },
  {
    icon: Clock,
    title: "Ultra-Fast Delivery",
    description: "Our optimized logistics ensure your gourmet meals arrive fresh and piping hot within 30 minutes.",
  },
  {
    icon: Star,
    title: "Verified Kitchens",
    description: "Every provider undergoes a 20-point quality and hygiene check before joining our platform.",
  },
  {
    icon: Truck,
    title: "Real-Time Tracking",
    description: "Know exactly where your food is with high-precision GPS tracking from kitchen to doorstep.",
  },
];

const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function WhyChooseFoodHub() {
  return (
    <section className="py-24 px-4 bg-white dark:bg-background overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block"
          >
            The FoodHub Edge
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-foreground">
            Why We Are <span className="text-primary">Different</span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            We don't just deliver food; we deliver an experience powered by safety, speed, and intelligence.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {REASONS.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="flex flex-col items-center text-center p-10 rounded-[2.5rem] bg-muted dark:bg-accent/5 border border-border/40 hover:bg-card dark:hover:bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 rotate-3 group-hover:rotate-0 transition-transform">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-foreground tracking-tight">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
