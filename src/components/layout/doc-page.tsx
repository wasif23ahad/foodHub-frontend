"use client";

import { ReactNode, useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocSection {
  id: string;
  title: string;
  icon?: LucideIcon;
  content: ReactNode;
}

interface DocPageProps {
  /** Pill text above the title, e.g. "LEGAL FRAMEWORK" or "HELP CENTER" */
  eyebrow: string;
  /** The page title — last word can be highlighted via `highlightLastWord` */
  title: string;
  highlightLastWord?: boolean;
  /** One or two short lines under the title */
  subtitle: ReactNode;
  /** Sections rendered with sidebar nav */
  sections: DocSection[];
  /** Icon for the eyebrow pill */
  EyebrowIcon?: LucideIcon;
  /** Optional children for custom content (like ContactForm) */
  children?: ReactNode;
}

export function DocPage({
  eyebrow,
  title,
  highlightLastWord = true,
  subtitle,
  sections,
  EyebrowIcon,
  children,
}: DocPageProps) {
  const words = title.split(" ");
  const lastWord = words.pop() ?? "";
  const leadWords = words.join(" ");

  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO — uses bg-background, no surprise color */}
      <header className="relative border-b border-border py-16 md:py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
        
        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary mb-6 shadow-sm">
            {EyebrowIcon && <EyebrowIcon className="h-3.5 w-3.5" />}
            {eyebrow}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-foreground tracking-tighter">
            {leadWords && <>{leadWords} </>}
            {highlightLastWord ? (
              <span className="text-primary">{lastWord}</span>
            ) : (
              lastWord
            )}
          </h1>

          <div className="mt-8 text-base md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            {subtitle}
          </div>
        </div>
      </header>

      {/* BODY — uses bg-muted/30 on top of bg-background for subtle elevation */}
      <main className="bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-20">
          <div className={cn(
            "grid gap-12",
            sections.length > 0 ? "md:grid-cols-[240px_1fr]" : "md:grid-cols-1"
          )}>
            {/* Sidebar nav */}
            {sections.length > 0 && (
              <aside className="md:sticky md:top-24 md:self-start hidden md:block">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 pl-2">
                  On this page
                </p>
                <nav className="flex flex-col gap-1">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className={cn(
                        "text-sm transition-all py-2 px-3 rounded-xl border border-transparent",
                        activeId === s.id
                          ? "bg-primary/10 text-primary font-bold border-primary/10 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted font-medium"
                      )}
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </aside>
            )}

            {/* Content Area */}
            <div className="space-y-12">
              {children}
              
              {/* Sections */}
              <article className="space-y-12">
                {sections.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <section
                      key={s.id}
                      id={s.id}
                      className="rounded-[2.5rem] border border-border bg-card p-8 md:p-12 scroll-mt-24 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4 mb-8">
                        {Icon && (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 shadow-inner">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                          {i + 1}. {s.title}
                        </h2>
                      </div>
                      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground [&_p]:text-foreground [&_p]:font-medium [&_p]:leading-relaxed [&_li]:text-foreground [&_li]:font-medium [&_strong]:text-foreground [&_strong]:font-black">
                        {s.content}
                      </div>
                    </section>
                  );
                })}
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
