"use client";

import { DocPage } from "@/components/layout/doc-page";
import { ShieldCheck, Eye, FileText, Lock } from "lucide-react";

export default function PrivacyPage() {
  return (
    <DocPage
      eyebrow="Privacy Matters"
      EyebrowIcon={ShieldCheck}
      title="Privacy Policy"
      subtitle={
        <>
          Last Updated: May 2026. Your privacy is our priority. Learn how we handle your data with transparency and care.
        </>
      }
      sections={[
        {
          id: "data-collection",
          title: "Information We Collect",
          icon: Eye,
          content: (
            <>
              <p>
                We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
              </p>
              <ul>
                <li>Usage Information: We collect info about your interactions with our services.</li>
                <li>Device Information: We collect info about your mobile device or computer.</li>
                <li>Location Information: We collect precise location data for delivery tracking.</li>
              </ul>
            </>
          ),
        },
        {
          id: "usage-of-data",
          title: "How We Use Information",
          icon: FileText,
          content: (
            <>
              <p>
                We use the information we collect to provide, maintain, and improve our services. This includes using the information to:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {[
                  "Process transactions and send related info",
                  "Personalize and improve the Services",
                  "Send you technical notices and alerts",
                  "Monitor and analyze trends and usage",
                  "Detect and prevent fraudulent transactions"
                ].map((usage, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border shadow-sm">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm font-bold text-foreground/80">{usage}</span>
                  </div>
                ))}
              </div>
            </>
          ),
        },
        {
          id: "security",
          title: "Data Security",
          icon: Lock,
          content: (
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. We use industry-standard encryption for all data at rest and in transit.
            </p>
          ),
        },
      ]}
    />
  );
}
