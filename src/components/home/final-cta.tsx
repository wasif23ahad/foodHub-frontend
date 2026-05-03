"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-24 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-card p-8 md:p-12 text-white h-[400px] flex flex-col justify-end shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <ShoppingBag className="h-48 w-48 rotate-12" />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-black mb-4">Hungry? <br />Order now.</h3>
              <p className="text-slate-300 mb-8 max-w-sm font-medium">
                Join thousands of happy customers and discover the best local flavors delivered to your door.
              </p>
              <Link href="/meals">
                <Button size="lg" className="bg-primary hover:bg-primary-dark text-white rounded-full px-8 h-14 font-bold group">
                  Start Your Order
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Provider CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative group overflow-hidden rounded-[2.5rem] bg-primary p-8 md:p-12 text-white h-[400px] flex flex-col justify-end shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Utensils className="h-48 w-48 -rotate-12" />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-black mb-4">Are you a <br />food provider?</h3>
              <p className="text-white/80 mb-8 max-w-sm font-medium">
                Reach more customers and grow your business with our AI-powered delivery platform.
              </p>
              <Link href="/register?role=PROVIDER">
                <Button size="lg" className="bg-white text-primary hover:bg-slate-100 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90 rounded-full px-8 h-14 font-bold group">
                  Join as a Seller
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
