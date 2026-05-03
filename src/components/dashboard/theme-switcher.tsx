"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {options.map((option) => {
        const Icon = option.icon;
        const active = theme === option.value;
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200",
              active
                ? "border-primary bg-primary/5 text-primary shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl",
              active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold uppercase tracking-wider">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
