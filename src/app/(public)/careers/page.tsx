"use client";

import { DocPage } from "@/components/layout/doc-page";
import { Briefcase, Heart, Rocket, Mail } from "lucide-react";

export default function CareersPage() {
  return (
    <DocPage
      eyebrow="Join Our Team"
      EyebrowIcon={Briefcase}
      title="Careers at FoodHub"
      subtitle="Join our talented team and build the future of food discovery and delivery."
      sections={[
        {
          id: "culture",
          title: "Our Culture",
          icon: Heart,
          content: (
            <p>
              We believe in ownership, transparency, and a passion for food. We're 
              building a community where everyone can thrive, from our developers 
              to our delivery partners.
            </p>
          ),
        },
        {
          id: "why-join",
          title: "Why Join Us?",
          icon: Rocket,
          content: (
            <p>
              Work on complex problems, grow with a fast-scaling startup, and make a 
              real impact on how thousands of people discover their next meal every day.
            </p>
          ),
        },
        {
          id: "apply",
          title: "How to Apply",
          icon: Mail,
          content: (
            <div className="space-y-4">
              <p>We're always looking for passionate designers, developers, and operations experts.</p>
              <div className="p-8 rounded-2xl bg-muted/50 border border-border text-center max-w-sm">
                <p className="font-bold text-foreground mb-2">Drop your resume at:</p>
                <a href="mailto:careers@foodhub.app" className="text-primary font-black hover:underline">careers@foodhub.app</a>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
