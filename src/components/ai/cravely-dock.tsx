"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Loader2, Minimize2, Maximize2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/providers/auth-provider";
import { ApiResponse } from "@/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  message: string;
  sessionId: string;
  citations: any[];
}

export function CravelyDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Cravely, your personal food scout. Hungry for something specific?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await api.post<ApiResponse<ChatResponse>>("/ai/chat", {
        message: userMessage,
        sessionId: sessionId
      });

      if (res.success) {
        setMessages(prev => [...prev, { role: "assistant", content: res.data.message }]);
        setSessionId(res.data.sessionId);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: res.message || "My circuits are a bit jammed. Can you try again?" }]);
      }
    } catch (error: any) {
      const errorMessage = error.message || "Sorry, I hit a snag. Can you check your connection?";
      setMessages(prev => [...prev, { role: "assistant", content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40, filter: "blur(10px)" }}
            animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                filter: "blur(0px)",
                height: isMinimized ? "auto" : "600px"
            }}
            exit={{ opacity: 0, scale: 0.95, y: 40, filter: "blur(10px)" }}
            className="pointer-events-auto w-[400px] mb-6 origin-bottom-right shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
          >
            <Card className="h-full border-none rounded-[2.5rem] overflow-hidden flex flex-col bg-white/95 dark:bg-card/95 backdrop-blur-xl border border-white/20">
              {/* Header */}
              <div className="bg-slate-900 dark:bg-slate-950 p-6 flex items-center justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-rose-600 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg tracking-tight leading-none mb-1">Cravely AI</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Active Assistant</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 relative z-10">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <ScrollArea className="flex-1 min-h-0 px-6 py-4" ref={scrollRef}>
                    <div className="space-y-6 pb-4">
                      {messages.map((m, i) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={i} 
                          className={cn(
                            "flex items-end gap-2",
                            m.role === "user" ? "flex-row-reverse" : "flex-row"
                          )}
                        >
                          {m.role === "assistant" && (
                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mb-1 border border-slate-200/50">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <div className={cn(
                            "max-w-[80%] p-4 rounded-[1.5rem] text-sm leading-relaxed",
                            m.role === "user" 
                              ? "bg-slate-900 text-white rounded-br-none shadow-xl shadow-slate-200/50 dark:shadow-none font-medium" 
                              : "bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-800"
                          )}>
                            {m.content}
                          </div>
                        </motion.div>
                      ))}
                      {isLoading && (
                        <div className="flex items-center gap-2">
                           <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Bot className="h-4 w-4 text-primary animate-pulse" />
                            </div>
                          <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 rounded-2xl rounded-bl-none border border-slate-100 dark:border-slate-800">
                            <div className="flex gap-1">
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-primary" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-primary" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input Container - Elevated */}
                  <div className="p-6 bg-white dark:bg-card border-t border-slate-100 dark:border-slate-800 mt-auto">
                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                      className="relative group"
                    >
                      <Input
                        placeholder="Ask about meals or delivery..."
                        className="pr-14 h-14 rounded-2xl border-none bg-slate-50 dark:bg-slate-900 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium placeholder:text-slate-400"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                      <Button 
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl transition-all",
                            input.trim() ? "bg-primary text-white shadow-lg shadow-primary/20 scale-100" : "bg-slate-200 text-slate-400 scale-95"
                        )}
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </form>
                    <div className="flex items-center justify-center gap-1.5 mt-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-default">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            FoodHub Intelligent Assistant
                        </span>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
        }}
        className={cn(
          "pointer-events-auto h-20 w-20 rounded-[2.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative group overflow-hidden transition-all duration-500",
          isOpen && "scale-0 rotate-90"
        )}
      >
        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 flex flex-col items-center">
            <Sparkles className="h-8 w-8 mb-0.5" />
            <span className="text-[8px] font-black uppercase tracking-tighter">AI</span>
        </div>
      </motion.button>
    </div>
  );
}
