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

interface Suggestion {
  id: string;
  name: string;
  similarity: number;
}

export function SearchSuggestions() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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
    enabled: debouncedQuery.length > 2,
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
  };

  return (
    <div className="relative w-full max-w-sm hidden lg:block" ref={containerRef}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search for meals (AI powered)..."
          className="pl-10 h-10 bg-muted/50 border-none focus-visible:ring-primary/20 focus-visible:bg-white transition-all rounded-full font-medium"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {suggestions && suggestions.length > 0 ? (
              <div className="p-2">
                <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Utensils className="h-3 w-3" />
                  Semantic Matches
                </div>
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(s.id)}
                    className="w-full text-left px-4 py-3 hover:bg-primary/5 rounded-xl transition-colors flex items-center justify-between group"
                  >
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200">{s.name}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-md uppercase">View</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="p-8 text-center text-sm text-muted-foreground font-medium">
                  No semantic matches found.
                </div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
