"use client";

import { DocPage } from "@/components/layout/doc-page";
import { Settings } from "lucide-react";

export default function CookieSettingsPage() {
  return (
    <DocPage
      eyebrow="Preference Center"
      EyebrowIcon={Settings}
      title="Cookie Settings"
      subtitle="Manage your privacy and cookie preferences."
      sections={[
        {
          id: "manage-preferences",
          title: "Manage Preferences",
          content: (
            <div className="space-y-6">
              <p>You can control which cookies are active during your session.</p>
              <div className="space-y-4 max-w-sm">
                <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/50 border border-border">
                  <span className="font-bold text-foreground">Strictly Necessary</span>
                  <span className="text-xs font-black text-primary uppercase tracking-widest">Always On</span>
                </div>
                <div className="flex items-center justify-between p-6 rounded-2xl border border-border opacity-50 grayscale">
                  <span className="font-bold text-foreground">Analytics</span>
                  <span className="text-[10px] font-black py-1 px-3 bg-muted rounded-full uppercase tracking-widest">Disabled</span>
                </div>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}
