"use client";

import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

const providers = [
  {
    id: "1",
    name: "Golden Wok",
    cuisine: "Chinese • Asian",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800&auto=format&fit=crop",
    location: "Downtown",
  },
  {
    id: "2",
    name: "Pasta Paradiso",
    cuisine: "Italian • Pizza",
    rating: 4.9,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop",
    location: "Upper East",
  },
  {
    id: "3",
    name: "Sushi Zen",
    cuisine: "Japanese • Sushi",
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=800&auto=format&fit=crop",
    location: "Westside",
  },
  {
    id: "4",
    name: "Burger Craft",
    cuisine: "American • Burgers",
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=800&auto=format&fit=crop",
    location: "Midtown",
  },
];

export function FeaturedProviders() {
  return (
    <section className="py-24 bg-white dark:bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <Badge className="bg-primary/10 text-primary border-none mb-4 px-4 py-1 rounded-full font-bold">Top Rated</Badge>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              Our Featured <span className="text-primary">Kitchens</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              Carefully curated local providers who meet our strict quality and hygiene standards.
            </p>
          </div>
          <Link href="/providers">
            <Button variant="ghost" className="group font-bold text-primary hover:bg-primary/5">
              View All Providers
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {providers.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-6 shadow-xl group-hover:shadow-primary/10 transition-all">
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-card/90 backdrop-blur-md px-3 py-1 rounded-2xl flex items-center gap-1.5 shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <span className="text-xs font-black">{provider.rating}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{provider.name}</h3>
                  <Badge variant="outline" className="rounded-full font-medium border-muted-foreground/20">{provider.location}</Badge>
                </div>
                <p className="text-sm text-muted-foreground font-medium">{provider.cuisine}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                  <MapPin className="h-3 w-3" />
                  <span>{provider.reviews} reviews</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
