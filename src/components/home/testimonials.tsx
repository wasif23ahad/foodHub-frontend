"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Food Blogger",
    content: "The AI recommendations are scarily accurate! It suggested a spicy Ramen bowl from Sushi Zen that became my absolute favorite.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=alex",
  },
  {
    name: "Sarah Miller",
    role: "Busy Professional",
    content: "Fastest delivery I've experienced. The tracking is real-time and the food always arrives steaming hot. Simply amazing!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "Michael Chen",
    role: "Local Resident",
    content: "I love supporting local kitchens. FoodHub makes it so easy to find hidden gems in my neighborhood that I never knew existed.",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=michael",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted dark:bg-accent/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
          Loved by <span className="text-primary">Thousands</span>
        </h2>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto mb-16">
          Hear from our community of food lovers who have transformed their dining experience with FoodHub.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-card p-8 rounded-[2rem] shadow-sm border border-border/50 relative text-left flex flex-col justify-between hover:shadow-xl hover:shadow-primary/5 transition-all"
            >
              <div className="absolute top-8 right-8 text-primary/10">
                <Quote className="h-12 w-12" />
              </div>
              
              <div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < t.rating ? "fill-accent text-accent" : "text-slate-200"}`} 
                    />
                  ))}
                </div>
                <p className="text-lg font-medium text-foreground mb-8 leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={t.avatar} />
                  <AvatarFallback>{t.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-foreground leading-none mb-1">{t.name}</h4>
                  <p className="text-xs text-muted-foreground font-semibold">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
