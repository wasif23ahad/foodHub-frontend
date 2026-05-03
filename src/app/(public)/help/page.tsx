"use client";

import { DocPage } from "@/components/layout/doc-page";
import { 
  LifeBuoy, 
  Search, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  User, 
  ChevronRight,
  MessageSquare,
  PlayCircle,
  HelpCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { motion } from "framer-motion";

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
    <DocPage
      eyebrow="Help Center"
      EyebrowIcon={LifeBuoy}
      title="How can we help?"
      subtitle={
        <div className="space-y-8">
          <div className="relative group max-w-xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search for articles, topics, or issues..." 
              className="h-16 pl-16 rounded-[2rem] border-border shadow-lg text-lg font-bold focus-visible:ring-offset-0 focus-visible:ring-primary/20 transition-all bg-card"
            />
          </div>
          <p className="text-muted-foreground">
            Browse our help categories or search for specific issues.
          </p>
        </div>
      }
      sections={[
        {
          id: "categories",
          title: "Help Categories",
          icon: ShoppingBag,
          content: (
            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              {categories.map((cat, i) => (
                <Card key={i} className="p-6 rounded-[2rem] bg-muted/30 border-border hover:border-primary/30 transition-all group">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors duration-500">
                    <cat.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-black text-foreground mb-2">{cat.title}</h3>
                  <p className="text-xs text-muted-foreground font-medium mb-4 leading-relaxed">{cat.description}</p>
                  <ul className="space-y-2">
                    {cat.articles.map((art, j) => (
                      <li key={j}>
                        <Link href="#" className="flex items-center text-[10px] font-black text-muted-foreground hover:text-primary transition-colors group/link uppercase tracking-widest">
                          <ChevronRight className="h-3 w-3 mr-1 transition-transform group-hover/link:translate-x-1" />
                          {art}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          ),
        },
        {
          id: "faqs",
          title: "Frequently Asked Questions",
          icon: HelpCircle,
          content: (
            <Accordion type="single" collapsible className="w-full mt-6">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="text-left font-bold text-foreground hover:text-primary hover:no-underline text-lg py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-medium text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ),
        },
        {
          id: "contact",
          title: "Still Need Help?",
          icon: MessageSquare,
          content: (
            <div className="space-y-6 mt-6">
              <p>Our support team is available 24/7. Use our live chat interface or check out our video guides.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="h-14 rounded-2xl font-black gap-3 shadow-lg shadow-primary/20 flex-1">
                  <MessageSquare className="h-5 w-5" /> Start Live Chat
                </Button>
                <Button variant="outline" className="h-14 rounded-2xl font-black gap-3 border-2 flex-1">
                  <PlayCircle className="h-5 w-5 text-primary" /> Video Tutorials
                </Button>
              </div>
            </div>
          ),
        }
      ]}
    />
  );
}
