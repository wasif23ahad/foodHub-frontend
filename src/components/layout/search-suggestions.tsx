"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Utensils } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: string;
  name: string;
  similarity: number;
  score: number;
  isKeywordMatch: boolean;
}

export function SearchSuggestions() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["search-suggestions", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const res = await api.get<ApiResponse<Suggestion[]>>(`/ai/search/suggestions?q=${debouncedQuery}`);
      return res.data;
    },
    enabled: debouncedQuery.length > 1,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    router.push(`/meals/${id}`);
    setIsOpen(false);
    setQuery("");
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || !suggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex].id);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm hidden lg:block" ref={containerRef}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="What are you craving? (AI search)..."
          className="pl-10 h-10 bg-muted/30 border-none focus-visible:ring-primary/20 focus-visible:bg-white transition-all rounded-full font-medium"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-card border-2 border-border/50 rounded-[1.5rem] shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
          >
            {suggestions && suggestions.length > 0 ? (
              <div className="p-2">
                <div className="px-3 py-2 flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Utensils className="h-3 w-3" />
                        Semantic Suggestions
                    </div>
                    <div className="bg-primary/10 text-primary text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                        AI Powered
                    </div>
                </div>
                {suggestions.map((s, index) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(s.id)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                        "w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group",
                        activeIndex === index ? "bg-primary/5 translate-x-1" : "hover:bg-primary/5"
                    )}
                  >
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{s.name}</span>
                        {s.similarity > 0 && (
                            <span className="text-[10px] text-muted-foreground font-medium italic">
                                {Math.round(s.similarity * 100)}% relevance match
                            </span>
                        )}
                    </div>
                    <div className={cn(
                        "transition-all duration-300",
                        activeIndex === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                    )}>
                        <div className="bg-primary text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase shadow-sm">Explore</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="p-10 text-center space-y-2">
                  <div className="text-sm text-muted-foreground font-bold italic">
                    "I couldn't find a perfect match for that..."
                  </div>
                  <p className="text-xs text-slate-400">Try searching for ingredients, cuisines, or a meal name!</p>
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
