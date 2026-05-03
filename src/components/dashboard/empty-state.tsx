import { ReactNode } from "react";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  children?: ReactNode; // for custom action layouts
}

export function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-16 text-center shadow-sm">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 transition-transform hover:scale-110 duration-300">
          <Icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
        </div>
        {/* Subtle accent dot, theme-safe */}
        <span
          aria-hidden
          className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent animate-pulse"
        />
      </div>

      <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">{description}</p>

      {action && (
        <Button asChild size="lg" className="rounded-xl px-8 shadow-lg shadow-primary/20 font-bold transition-all hover:scale-105 active:scale-95">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
      {children}
    </div>
  );
}
