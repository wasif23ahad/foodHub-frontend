"use client";

import { DocPage } from "@/components/layout/doc-page";
import { ShieldCheck, Utensils, Truck, AlertTriangle } from "lucide-react";

export default function SafetyPage() {
  return (
    <DocPage
      eyebrow="Safety First"
      EyebrowIcon={ShieldCheck}
      title="Community Safety"
      subtitle="Your safety is our top priority. Learn how we keep FoodHub safe for everyone."
      sections={[
        {
          id: "food-standards",
          title: "Food Standards",
          icon: Utensils,
          content: (
            <p>
              All providers on FoodHub must adhere to high hygiene standards and pass 
              regular health inspections. We verify each kitchen before they can start 
              serving our community.
            </p>
          ),
        },
        {
          id: "secure-deliveries",
          title: "Secure Deliveries",
          icon: Truck,
          content: (
            <p>
              Our delivery partners are trained to handle food safely and we offer 
              contactless delivery options for your peace of mind. Every delivery 
              is tracked in real-time.
            </p>
          ),
        },
        {
          id: "reporting",
          title: "Reporting Issues",
          icon: AlertTriangle,
          content: (
            <p>
              If you encounter any safety concerns, please report them immediately via 
              our support team. We take every report seriously and investigate 
              thoroughly to maintain our community standards.
            </p>
          ),
        },
      ]}
    />
  );
}
