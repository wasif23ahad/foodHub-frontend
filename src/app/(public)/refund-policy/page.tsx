"use client";

import { DocPage } from "@/components/layout/doc-page";
import { RotateCcw, ShieldCheck, Clock, Wallet } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <DocPage
      eyebrow="Refund Policy"
      EyebrowIcon={RotateCcw}
      title="Refund Policy"
      subtitle="Clear guidelines on refunds and adjustments."
      sections={[
        {
          id: "eligibility",
          title: "Eligibility for Refunds",
          icon: ShieldCheck,
          content: (
            <p>
              Refunds are typically issued if the food arrived damaged, was incorrect, 
              or if the order was never delivered. We investigate every claim with our 
              delivery partners to ensure a fair resolution.
            </p>
          ),
        },
        {
          id: "process-time",
          title: "Process Time",
          icon: Clock,
          content: (
            <p>
              Once approved, refunds are processed within 3-5 business days back to 
              your original payment method. The exact time depends on your bank's 
              processing cycle.
            </p>
          ),
        },
        {
          id: "store-credit",
          title: "Store Credit",
          icon: Wallet,
          content: (
            <p>
              In many cases, we can offer instant FoodHub store credit as an alternative 
              to a bank refund. This is the fastest way to get back to ordering your 
              favorite meals.
            </p>
          ),
        },
      ]}
    />
  );
}
