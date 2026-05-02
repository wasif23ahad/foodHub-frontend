"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Users, Utensils, Star, Clock } from "lucide-react";

interface StatItemProps {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ElementType;
  delay?: number;
}

function StatItem({ label, value, suffix = "", icon: Icon, delay = 0 }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000; // 2 seconds
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center p-6 bg-white dark:bg-card rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all hover:-translate-y-1"
    >
      <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-3xl font-black text-foreground mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}

export function StatsSection() {
  const stats = [
    { label: "Happy Customers", value: 12500, suffix: "+", icon: Users },
    { label: "Gourmet Meals", value: 850, suffix: "+", icon: Utensils },
    { label: "Avg. Rating", value: 4, suffix: ".9", icon: Star },
    { label: "Fast Delivery", value: 25, suffix: "m", icon: Clock },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              icon={stat.icon}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
