"use client";

import { motion } from "framer-motion";
import { Users, Heart, Target, Shield, Utensils, Star, Award, Globe } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
            alt="Delicious food spread"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-primary font-black uppercase tracking-[0.3em] text-sm mb-6 block">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8">
              Revolutionizing How You <span className="text-primary">Eat.</span>
            </h1>
            <p className="text-xl text-slate-300 font-medium leading-relaxed">
              FoodHub isn't just a delivery app. We're a technology platform built to bridge the gap between talented culinary artists and food lovers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="text-white">
                <p className="text-4xl font-black mb-1">{stat.value}</p>
                <p className="text-sm font-bold text-white/70 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight text-slate-900">Our <span className="text-primary">Mission</span></h2>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  At FoodHub, our mission is to empower local providers by giving them the tools, technology, and audience they need to succeed in the digital economy. We strive to make gourmet and home-cooked meals accessible to everyone, anywhere.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-primary/20 transition-colors">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Quality First</h4>
                  <p className="text-sm text-slate-500 font-medium">We never compromise on the quality of ingredients or service.</p>
                </div>
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-primary/20 transition-colors">
                  <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Utensils className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">Chef Empowered</h4>
                  <p className="text-sm text-slate-500 font-medium">Built by foodies, for the artisans who create the magic.</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl rotate-3"
            >
              <Image 
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop"
                alt="Chef cooking"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-6">Values That Define Us</h2>
            <p className="text-lg text-slate-600 font-medium">Our culture is built on transparency, innovation, and a relentless focus on customer satisfaction.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-10 rounded-[2.5rem] bg-white shadow-xl shadow-slate-100 border border-slate-50 flex flex-col items-center group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="h-20 w-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:rotate-12 transition-all duration-500">
                  <value.icon className="h-10 w-10 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join the Team */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -mr-48 -mt-48" />
            
            <div className="relative z-10 max-w-2xl text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
                Want to <span className="text-primary">Join Us?</span>
              </h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed mb-10">
                We're always looking for passionate individuals who love food and technology. Check out our open roles and be part of the future of dining.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button size="lg" className="rounded-2xl h-14 px-10 font-black shadow-lg shadow-primary/20">
                  View Careers
                </Button>
                <Button variant="outline" size="lg" className="rounded-2xl h-14 px-10 font-black text-white border-white/20 hover:bg-white/10">
                  Contact Us
                </Button>
              </div>
            </div>

            <div className="relative z-10 flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 w-20 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-2xl">
                  <Image 
                    src={`https://i.pravatar.cc/150?u=${i + 10}`}
                    alt="Team member"
                    width={80}
                    height={80}
                  />
                </div>
              ))}
              <div className="h-20 w-20 rounded-full border-4 border-slate-900 bg-primary flex items-center justify-center text-white font-black text-xl shadow-2xl">
                +14
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
