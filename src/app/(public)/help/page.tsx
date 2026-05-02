"use client";

import { motion } from "framer-motion";
import { Search, ShoppingBag, Truck, CreditCard, User, HelpCircle, ChevronRight, BookOpen, MessageSquare, PlayCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";

const categories = [
  {
    icon: ShoppingBag,
    title: "Ordering",
    description: "How to place, track, and modify orders.",
    articles: ["Placing your first order", "Changing delivery address", "Adding items to existing order", "Order status explained"]
  },
  {
    icon: Truck,
    title: "Delivery",
    description: "Fees, times, and delivery issues.",
    articles: ["Delivery coverage areas", "Tracking your driver", "Delayed delivery guide", "Safety and hygiene standards"]
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Refunds, promos, and payment methods.",
    articles: ["Accepted payment methods", "Refund processing time", "Using promo codes", "Security of transactions"]
  },
  {
    icon: User,
    title: "Account",
    description: "Manage your profile and security.",
    articles: ["Resetting your password", "Deleting your account", "Updating business profile", "Notification settings"]
  }
];

const faqs = [
  {
    question: "What is FoodHub?",
    answer: "FoodHub is a community-driven food delivery platform that connects home-chefs and local restaurants with food lovers. We prioritize quality, speed, and intelligence."
  },
  {
    question: "How do I become a provider?",
    answer: "Go to our 'Become a Provider' page, fill out the application, and our team will get in touch with you within 24-48 hours for verification."
  },
  {
    question: "How do refunds work?",
    answer: "If there's an issue with your order, contact support within 2 hours. Refunds are processed back to your original payment method within 5-7 business days."
  }
];

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Search Header */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
              How can we <span className="text-white/80">help you?</span>
            </h1>
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search for articles, topics, or issues..." 
                className="h-16 pl-16 rounded-[2rem] border-none shadow-2xl text-lg font-bold focus-visible:ring-offset-0 focus-visible:ring-white/20 transition-all bg-white"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full p-8 border-none shadow-xl shadow-slate-100 rounded-[2.5rem] bg-white group hover:-translate-y-2 transition-all duration-500">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-500">
                    <cat.icon className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{cat.title}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">{cat.description}</p>
                  
                  <ul className="space-y-3 border-t pt-6 border-slate-50">
                    {cat.articles.map((art, j) => (
                      <li key={j}>
                        <Link href="#" className="flex items-center text-xs font-bold text-slate-400 hover:text-primary transition-colors group/link">
                          <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover/link:translate-x-1" />
                          {art}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Support */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 space-y-6">
              <span className="text-primary font-black uppercase tracking-[0.3em] text-xs block">Premium Support</span>
              <h2 className="text-4xl font-black tracking-tight text-slate-900">Need immediate <span className="text-primary">assistance?</span></h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                Our support team is available 24/7. Use our premium chat interface or check out our video guides.
              </p>
              <div className="flex flex-col gap-4">
                <Button className="h-14 rounded-2xl font-black gap-3 shadow-lg shadow-primary/20">
                  <MessageSquare className="h-5 w-5" /> Start Live Chat
                </Button>
                <Button variant="outline" className="h-14 rounded-2xl font-black gap-3 border-2">
                  <PlayCircle className="h-5 w-5 text-primary" /> Video Tutorials
                </Button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Card className="p-8 md:p-12 border-none shadow-2xl shadow-slate-100 rounded-[3rem] bg-white">
                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" /> Popular FAQ
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-b-slate-100 py-2">
                      <AccordionTrigger className="text-left font-black text-slate-700 hover:text-primary hover:no-underline text-lg">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-500 font-medium text-base leading-relaxed pt-2">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Still need help? */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-[3rem] bg-slate-900 p-12 text-center relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mb-32 -mr-32" />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">Still have questions?</h2>
            <p className="text-lg text-slate-400 font-medium mb-10 max-w-2xl mx-auto relative z-10">
              Can't find the answer you're looking for? Please chat with our friendly team or reach out via email.
            </p>
            <div className="flex flex-wrap gap-4 justify-center relative z-10">
              <Link href="/contact">
                <Button size="lg" className="h-14 px-10 rounded-2xl font-black shadow-lg shadow-primary/20">
                  Contact Support
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-14 px-10 rounded-2xl font-black text-white border-white/20 hover:bg-white/10">
                Check Community Forum
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
