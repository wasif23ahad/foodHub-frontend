"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Eye, Lock, FileText, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      {/* Header */}
      <section className="py-24 bg-white border-b">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6">
              <ShieldCheck className="h-4 w-4" />
              Privacy Matters
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
              Privacy <span className="text-primary">Policy.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Last Updated: May 2026. Your privacy is our priority. Learn how we handle your data with transparency and care.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12">
              {/* Quick Links / Sidebar */}
              <div className="md:col-span-1 hidden md:block">
                <div className="sticky top-24 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">On this page</h4>
                  {["Data Collection", "Usage of Data", "Security", "Your Rights"].map((item) => (
                    <button key={item} className="flex items-center text-sm font-bold text-slate-600 hover:text-primary transition-colors text-left">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Policy Text */}
              <div className="md:col-span-3 space-y-16">
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-slate-900">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-black">1. Information We Collect</h2>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
                  </p>
                  <ul className="space-y-4 list-disc pl-6 text-slate-600 font-medium">
                    <li>Usage Information: We collect info about your interactions with our services.</li>
                    <li>Device Information: We collect info about your mobile device or computer.</li>
                    <li>Location Information: We collect precise location data for delivery tracking.</li>
                  </ul>
                </section>

                <Separator />

                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-slate-900">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-black">2. How We Use Information</h2>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services. This includes using the information to:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      "Process transactions and send related info",
                      "Personalize and improve the Services",
                      "Send you technical notices and alerts",
                      "Monitor and analyze trends and usage",
                      "Detect and prevent fraudulent transactions"
                    ].map((usage, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm font-bold text-slate-700">{usage}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <Separator />

                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-slate-900">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black">3. Data Security</h2>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. We use industry-standard encryption for all data at rest and in transit.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
