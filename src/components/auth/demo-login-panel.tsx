"use client";

import { User, Utensils, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DemoLoginPanelProps {
  onSelect: (email: string, password: string, role: "user" | "seller" | "admin") => void;
}

export function DemoLoginPanel({ onSelect }: DemoLoginPanelProps) {
  const demos = [
    {
      label: "Demo Customer",
      email: "demo-customer@foodhub.app",
      password: "Demo@1234",
      role: "user" as const,
      icon: User,
      description: "Browse & order meals",
    },
    {
      label: "Demo Provider",
      email: "demo-provider@foodhub.app",
      password: "Demo@1234",
      role: "seller" as const,
      icon: Utensils,
      description: "Manage kitchen & menu",
    },
    {
      label: "Demo Admin",
      email: "demo-admin@foodhub.app",
      password: "Demo@1234",
      role: "admin" as const,
      icon: ShieldCheck,
      description: "Moderate platform",
    },
  ];

  return (
    <div className="mt-8 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-slate-500 font-medium">
            Try a demo account
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {demos.map((demo) => (
          <Button
            key={demo.label}
            variant="outline"
            className="flex h-auto items-center justify-start gap-4 p-4 text-left hover:bg-accent transition-all hover:border-primary group"
            onClick={() => onSelect(demo.email, demo.password, demo.role)}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <demo.icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold group-hover:text-primary transition-colors">
                {demo.label}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {demo.description}
              </span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
