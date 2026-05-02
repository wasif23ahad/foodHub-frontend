"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How does the AI recommendation work?",
    answer: "Our 'Cravely AI' analyzes your past orders, ratings, and dietary preferences to suggest meals that match your unique taste profile. It even considers real-time factors like the time of day and trending items in your area."
  },
  {
    question: "How can I become a food provider?",
    answer: "Click on the 'Become a Provider' button in the hero section or footer. You'll need to provide business details, hygiene certificates, and your menu. Our team will review your application within 48 hours."
  },
  {
    question: "Is there a delivery fee?",
    answer: "Delivery fees vary based on your distance from the provider. Many of our featured kitchens offer free delivery for orders above a certain amount. You'll see the exact fee before you checkout."
  },
  {
    question: "What if I have food allergies?",
    answer: "Every meal listing includes a detailed 'Dietary Preferences' tag (e.g., Gluten-Free, Halal, Vegan). You can also use the Cravely AI to filter for specific allergens or leave notes for the provider during checkout."
  },
  {
    question: "Can I track my order in real-time?",
    answer: "Yes! Once your order is accepted, you can track its status from 'Preparing' to 'Out for Delivery' directly from your dashboard. You'll receive live notifications at every stage."
  },
  {
    question: "How do I contact support?",
    answer: "You can visit our dedicated 'Help & Support' page or use the 'Contact' form. For urgent order issues, we recommend using the live chat feature available in your customer dashboard."
  }
];

function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean; 
  onClick: () => void 
}) {
  return (
    <div className="border-b border-border/60 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left hover:text-primary transition-colors group"
      >
        <span className="text-lg md:text-xl font-bold tracking-tight">{question}</span>
        <div className={`shrink-0 ml-4 p-1 rounded-full transition-all duration-300 ${isOpen ? "bg-primary text-white rotate-180" : "bg-slate-100 dark:bg-accent/20 text-slate-500"}`}>
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="pb-6 text-muted-foreground leading-relaxed font-medium">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Everything you need to know about FoodHub and how we work.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
