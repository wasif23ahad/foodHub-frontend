import { cn } from "@/lib/utils";

// Status pill with semantic colors that work in both light and dark mode
const STATUS_STYLES: Record<string, string> = {
  // Order Statuses
  available:    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  unavailable:  "bg-muted text-muted-foreground border-border",
  pending:      "bg-amber-500/10 text-amber-500 border-amber-500/20",
  preparing:    "bg-blue-500/10 text-blue-500 border-blue-500/20",
  ready:        "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  delivered:    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled:    "bg-destructive/10 text-destructive border-destructive/20",
  hidden:       "bg-muted text-muted-foreground border-border",
  active:       "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  banned:       "bg-destructive/10 text-destructive border-destructive/20",
  inactive:     "bg-muted text-muted-foreground border-border",
  suspended:    "bg-destructive/10 text-destructive border-destructive/20",
  
  // Uppercase variants (mapping directly for convenience)
  PLACED:       "bg-amber-500/10 text-amber-500 border-amber-500/20",
  PREPARING:    "bg-blue-500/10 text-blue-500 border-blue-500/20",
  READY:        "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  DELIVERED:    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  CANCELLED:    "bg-destructive/10 text-destructive border-destructive/20",
} as const;

export function StatusPill({ value, className }: { value: string; className?: string }) {
  const style = STATUS_STYLES[value as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.unavailable;
  const isInactive = value.toLowerCase() === "unavailable" || value.toLowerCase() === "hidden" || value.toLowerCase() === "cancelled";
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize transition-all duration-200",
        style,
        className
      )}
    >
      <span className={cn(
        "h-1.5 w-1.5 rounded-full bg-current", 
        !isInactive && "animate-pulse"
      )} />
      {value.toLowerCase()}
    </span>
  );
}

// Dietary badge with category-appropriate colors
const DIETARY_STYLES: Record<string, string> = {
  HALAL:      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  VEGAN:      "bg-green-500/10 text-green-500 border-green-500/20",
  VEGETARIAN: "bg-lime-500/10 text-lime-500 border-lime-500/20",
  GLUTEN_FREE: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  KETO:        "bg-blue-500/10 text-blue-500 border-blue-500/20",
  REGULAR:    "bg-muted text-muted-foreground border-border",
};

export function DietaryBadge({ value, className }: { value: string; className?: string }) {
  const normalizedValue = value.toUpperCase();
  const style = DIETARY_STYLES[normalizedValue] ?? DIETARY_STYLES.REGULAR;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
        style,
        className
      )}
    >
      {value}
    </span>
  );
}
