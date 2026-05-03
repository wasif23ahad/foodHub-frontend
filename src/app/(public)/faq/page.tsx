"use client";

import { DocPage } from "@/components/layout/doc-page";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  { q: "How fast is delivery?", a: "Most orders arrive within 30-45 minutes depending on your location." },
  { q: "Can I cancel my order?", a: "Yes, you can cancel before the restaurant starts preparing your food." },
  { q: "Do you have gluten-free options?", a: "Absolutely! Many of our providers offer gluten-free and vegan alternatives. Use the search filters to find them." },
  { q: "How do I become a provider?", a: "Click on 'Become a Provider' in the footer and sign up for a provider account." }
];

export default function FAQPage() {
  return (
    <DocPage
      eyebrow="Help Center"
      EyebrowIcon={HelpCircle}
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about ordering on FoodHub."
      sections={[
        {
          id: "all-questions",
          title: "Common Questions",
          icon: HelpCircle,
          content: (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border">
                  <AccordionTrigger className="text-left text-foreground font-bold hover:no-underline py-4 text-lg">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-medium text-base leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ),
        },
      ]}
    />
  );
}
