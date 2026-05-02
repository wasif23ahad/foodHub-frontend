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
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I hit a snag. Can you try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                height: isMinimized ? "auto" : "550px"
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="pointer-events-auto w-[380px] mb-4 origin-bottom-right shadow-2xl"
          >
            <Card className="h-full border-none rounded-[2rem] overflow-hidden flex flex-col bg-white dark:bg-card">
              {/* Header */}
              <div className="bg-primary p-4 flex items-center justify-between text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm tracking-tight">Cravely AI</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-white/70 uppercase">Online Scout</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-white/10 rounded-lg"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-white hover:bg-white/10 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                    <div className="space-y-6 pb-4">
                      {messages.map((m, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "flex",
                            m.role === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div className={cn(
                            "max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed",
                            m.role === "user" 
                              ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10" 
                              : "bg-slate-50 dark:bg-accent/10 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-accent/20"
                          )}>
                            {m.content}
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-slate-50 dark:bg-accent/10 p-4 rounded-2xl rounded-tl-none border border-slate-100">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="p-4 border-t bg-slate-50/50">
                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                      className="relative"
                    >
                      <Input
                        placeholder="Ask about a meal, diet, or delivery..."
                        className="pr-12 h-14 rounded-2xl border-2 border-slate-100 bg-white focus-visible:ring-primary/20 focus-visible:border-primary/20 transition-all font-medium"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                      />
                      <Button 
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl shadow-lg shadow-primary/20"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                    <p className="text-[9px] text-center text-slate-400 mt-2 font-bold uppercase tracking-widest">
                        Powered by Gemini 1.5 Flash
                    </p>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
        }}
        className={cn(
          "pointer-events-auto h-16 w-16 rounded-[2rem] bg-slate-900 text-white flex items-center justify-center shadow-2xl relative group overflow-hidden transition-all duration-500",
          isOpen && "scale-0 rotate-90"
        )}
      >
        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        <Bot className="h-8 w-8 relative z-10" />
      </motion.button>
    </div>
  );
}
