"use client";

import { DocPage } from "@/components/layout/doc-page";
import { Sparkles, Heart, Shield, Target, Globe, Award, Utensils } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const values = [
  {
    icon: Heart,
    title: "Passion for Food",
    description: "We believe food is the ultimate connector. Our passion drives us to discover the best local kitchens."
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "Every provider is verified. We ensure the highest standards of hygiene and quality for your peace of mind."
  },
  {
    icon: Target,
    title: "Mission Driven",
    description: "Empowering local home-chefs and small restaurants to reach thousands of foodies across the country."
  },
  {
    icon: Globe,
    title: "Sustainability",
    description: "Optimizing delivery routes and reducing waste through intelligent AI-driven logistics."
  }
];

const stats = [
  { label: "Active Users", value: "50K+" },
  { label: "Verified Providers", value: "1.2K+" },
  { label: "Meals Delivered", value: "2M+" },
  { label: "Cities Covered", value: "12+" }
];

export default function AboutPage() {
  return (
    <DocPage
      eyebrow="Our Story"
      EyebrowIcon={Sparkles}
      title="Revolutionizing How You Eat"
      subtitle={
        <>
          FoodHub isn&apos;t just a delivery app. We&apos;re a technology platform built to bridge 
          the gap between talented culinary artists and food lovers.
        </>
      }
      sections={[
        {
          id: "mission",
          title: "Our Mission",
          icon: Target,
          content: (
            <div className="space-y-8">
              <p>
                At FoodHub, our mission is to empower local providers by giving them 
                the tools, technology, and audience they need to succeed in the digital 
                economy. We strive to make gourmet and home-cooked meals accessible 
                to everyone, anywhere.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-muted/50 border border-border group hover:border-primary/20 transition-colors">
                  <div className="h-12 w-12 rounded-2xl bg-card flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2 text-base">Quality First</h4>
                  <p className="text-xs text-muted-foreground font-medium">We never compromise on the quality of ingredients or service.</p>
                </div>
                <div className="p-6 rounded-3xl bg-muted/50 border border-border group hover:border-primary/20 transition-colors">
                  <div className="h-12 w-12 rounded-2xl bg-card flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Utensils className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground mb-2 text-base">Chef Empowered</h4>
                  <p className="text-xs text-muted-foreground font-medium">Built by foodies, for the artisans who create the magic.</p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "values",
          title: "Our Values",
          icon: Heart,
          content: (
            <div className="grid sm:grid-cols-2 gap-8">
              {values.map((value, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-foreground text-lg">{value.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          ),
        },
        {
          id: "stats",
          title: "FoodHub in Numbers",
          icon: Globe,
          content: (
            <div className="grid grid-cols-2 gap-8 text-center bg-primary/10 rounded-[2rem] p-10 border border-primary/20">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="text-3xl font-black text-primary mb-1 tracking-tighter">{stat.value}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          ),
        }
      ]}
    >
      {/* Optional: Add the hero image or other custom content here if needed, 
          but for now the DocPage sections cover the content well. */}
    </DocPage>
  );
}
