"use client";

import { DocPage } from "@/components/layout/doc-page";
import { Scale, FileText, Gavel, ShieldCheck, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <DocPage
      eyebrow="Legal Framework"
      EyebrowIcon={Scale}
      title="Terms of Service"
      subtitle={
        <>
          Last updated: May 2026. Please read these terms carefully before using FoodHub.
          By using our platform, you agree to these conditions.
        </>
      }
      sections={[
        {
          id: "user-agreement",
          title: "User Agreement",
          icon: FileText,
          content: (
            <p>
              By accessing or using the FoodHub platform, you agree to be bound by these
              Terms. If you do not agree to these terms, you may not use the services.
              You must be at least 18 years old to create an account.
            </p>
          ),
        },
        {
          id: "provider-obligations",
          title: "Provider Obligations",
          icon: Gavel,
          content: (
            <p>
              Providers on FoodHub are independent contractors and are solely responsible
              for the safety, hygiene, accurate description, and timely preparation of
              meals listed on the platform.
            </p>
          ),
        },
        {
          id: "payment-fees",
          title: "Payment & Fees",
          icon: ShieldCheck,
          content: (
            <p>
              All payments are processed through our payment partners. FoodHub charges a
              service fee on each order, which is clearly displayed at checkout. Refunds
              are governed by our Refund Policy.
            </p>
          ),
        },
        {
          id: "liability",
          title: "Liability",
          icon: AlertTriangle,
          content: (
            <p>
              FoodHub acts as a marketplace connecting customers with providers. We are
              not liable for the quality, safety, or accuracy of meals prepared by
              providers, but we work to maintain quality standards through our verification
              process.
            </p>
          ),
        },
      ]}
    />
  );
}
