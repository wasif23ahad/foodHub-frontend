"use client";

import { motion } from "framer-motion";
import { Scale, FileText, Gavel, AlertTriangle, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
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
              <Scale className="h-4 w-4" />
              Legal Framework
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-8">
              Terms of <span className="text-primary">Service.</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Last Updated: May 2026. Please read these terms carefully before using FoodHub. By using our platform, you agree to these conditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12">
              {/* Sidebar */}
              <div className="md:col-span-1 hidden md:block">
                <div className="sticky top-24 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Legal Sections</h4>
                  {["User Agreement", "Provider Rules", "Payments & Fees", "Liability"].map((item) => (
                    <button key={item} className="flex items-center text-sm font-bold text-slate-600 hover:text-primary transition-colors text-left">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Terms Text */}
              <div className="md:col-span-3 space-y-16">
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-slate-900">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-black">1. User Agreement</h2>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    By accessing or using the FoodHub platform, you agree to be bound by these Terms. If you do not agree to these terms, you may not use the services. You must be at least 18 years old to create an account.
                  </p>
                </section>

                <Separator />

                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-slate-900">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Gavel className="h-5 w-5 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-black">2. Provider Obligations</h2>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Providers on FoodHub are independent contractors and are solely responsible for the quality, safety, and legal compliance of the food items they list. FoodHub acts as a marketplace and logistics facilitator.
                  </p>
                </section>

                <Separator />

                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-slate-900">
                    <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-rose-600" />
                    </div>
                    <h2 className="text-2xl font-black">3. Limitation of Liability</h2>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    In no event shall FoodHub, its directors, or employees be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, or other intangible losses.
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
