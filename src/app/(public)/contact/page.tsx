"use client";

import { DocPage } from "@/components/layout/doc-page";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from "lucide-react";
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
    <DocPage
      eyebrow="Get in Touch"
      EyebrowIcon={Mail}
      title="Contact Us"
      subtitle="Have a question, suggestion, or partnership idea? We'd love to hear from you."
      sections={[]}
    >
      <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
        {/* Contact info column */}
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: "hello@foodhub.app", sub: "Replies in ~2h" },
            { icon: Phone, label: "Phone", value: "+880 1973 116555", sub: "Available 24/7" },
            { icon: MapPin, label: "Address", value: "Dhaka, Bangladesh", sub: "Tech Plaza, Banani" },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="rounded-3xl border border-border bg-card p-6 flex items-start gap-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-inner">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</p>
                <p className="text-foreground font-black text-lg tracking-tight leading-none mb-1">{value}</p>
                <p className="text-[10px] font-bold text-muted-foreground italic uppercase tracking-widest">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form column */}
        <Card className="rounded-[3rem] border border-border bg-card p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10 gap-6">
              <div>
                <h2 className="text-3xl font-black tracking-tight text-foreground">Send a <span className="text-primary">Message</span></h2>
                <p className="text-muted-foreground font-medium text-sm mt-1">We typically respond within 24 hours.</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
                  <Input name="name" required placeholder="John Doe" className="h-14 rounded-2xl border-border bg-muted/30 focus:bg-card focus:border-primary/50 transition-all font-bold px-6 shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
                  <Input name="email" type="email" required placeholder="john@example.com" className="h-14 rounded-2xl border-border bg-muted/30 focus:bg-card focus:border-primary/50 transition-all font-bold px-6 shadow-inner" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Subject</label>
                <Input name="subject" required placeholder="How can we help?" className="h-14 rounded-2xl border-border bg-muted/30 focus:bg-card focus:border-primary/50 transition-all font-bold px-6 shadow-inner" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Your Message</label>
                <Textarea name="message" required placeholder="Tell us more about your request..." className="min-h-[160px] rounded-[2rem] border-border bg-muted/30 focus:bg-card focus:border-primary/50 transition-all font-bold p-8 text-lg shadow-inner" />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-16 rounded-[2rem] text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all gap-3"
              >
                {isSubmitting ? <Clock className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                {isSubmitting ? "Sending..." : "Deliver My Message"}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </DocPage>
  );
}
