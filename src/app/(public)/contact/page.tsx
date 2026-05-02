"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { api } from "@/lib/api";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await api.post("/public/contact", data);
      toast.success("Message sent! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(225,29,72,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs mb-6 block">Get In Touch</span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8">
              Let's Start a <span className="text-primary">Conversation.</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Have a question about FoodHub? Whether you're a hungry customer or a potential partner, we're here to help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 -mt-20 px-4 relative z-20">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] bg-white group hover:bg-primary transition-all duration-500">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                    <Mail className="h-7 w-7 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-white mb-2">Email Us</h3>
                  <p className="text-slate-500 group-hover:text-white/80 font-medium mb-4 italic">Expect a reply within 2 hours.</p>
                  <a href="mailto:support@foodhub.com" className="text-lg font-black text-primary group-hover:text-white underline decoration-2 underline-offset-4">support@foodhub.com</a>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-8 border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] bg-white group hover:bg-primary transition-all duration-500">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                    <Phone className="h-7 w-7 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-white mb-2">Call Center</h3>
                  <p className="text-slate-500 group-hover:text-white/80 font-medium mb-4 italic">Available 24/7 for you.</p>
                  <a href="tel:+880123456789" className="text-lg font-black text-primary group-hover:text-white underline decoration-2 underline-offset-4">+880 1234 567 89</a>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card className="p-8 border-none shadow-2xl shadow-slate-100 rounded-[2.5rem] bg-white group hover:bg-primary transition-all duration-500">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors">
                    <MapPin className="h-7 w-7 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-white mb-2">Office HQ</h3>
                  <p className="text-slate-500 group-hover:text-white/80 font-medium mb-4 italic">Visit our innovative workspace.</p>
                  <p className="text-lg font-black text-primary group-hover:text-white">Level 4, Tech Plaza, Banani, Dhaka</p>
                </Card>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card className="p-10 md:p-16 border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rounded-[3rem] bg-white h-full">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                  <div>
                    <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Send a <span className="text-primary">Message</span></h2>
                    <p className="text-slate-500 font-medium">We'd love to hear from you. Fill out the form below.</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 text-emerald-600 font-bold text-sm">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Support Team Online
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                      <Input name="name" required placeholder="John Doe" className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary/20 transition-all font-bold px-6" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                      <Input name="email" type="email" required placeholder="john@example.com" className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary/20 transition-all font-bold px-6" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                    <Input name="subject" required placeholder="How can we help?" className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary/20 transition-all font-bold px-6" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                    <Textarea name="message" required placeholder="Tell us more about your request..." className="min-h-[200px] rounded-[2rem] border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary/20 transition-all font-bold p-8 text-lg" />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-16 rounded-[2rem] text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-3"
                  >
                    {isSubmitting ? <Clock className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                    {isSubmitting ? "Sending..." : "Deliver My Message"}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Support Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 mb-6">Connect on <span className="text-primary">Social</span></h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                Stay updated with the latest offers, new provider launches, and community stories. We're active on all major platforms.
              </p>
            </div>
            
            <div className="flex gap-4">
              {[
                { icon: Facebook, color: "bg-[#1877F2]" },
                { icon: Twitter, color: "bg-[#1DA1F2]" },
                { icon: Instagram, color: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]" },
                { icon: Linkedin, color: "bg-[#0A66C2]" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`h-16 w-16 rounded-2xl ${social.color} flex items-center justify-center text-white shadow-xl`}
                >
                  <social.icon className="h-7 w-7" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
