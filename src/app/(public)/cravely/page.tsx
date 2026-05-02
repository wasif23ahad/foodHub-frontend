"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Loader2, Bot, Trash2, History, Utensils, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { streamCravelyChat } from "@/lib/cravely-stream";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
}

export default function CravelyPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to the full Cravely experience. I'm here to help you navigate the world of FoodHub. Ask me anything about meals, providers, or even culinary advice!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      setMessages(prev => [...prev, { role: "assistant", content: "", citations: [] }]);
      await streamCravelyChat({
        message: userMessage,
        sessionId,
        onToken: (text) => {
          setMessages(prev => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              next[next.length - 1] = { ...last, content: `${last.content}${text}` };
            }
            return next;
          });
        },
        onCitations: (ids) => {
          setMessages(prev => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              next[next.length - 1] = { ...last, citations: ids };
            }
            return next;
          });
        },
        onDone: (payload) => setSessionId(payload.sessionId),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "I'm having trouble connecting to my culinary brain. Give me a second and try again?";
      setMessages(prev => [...prev, { role: "assistant", content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "Chat cleared. What's on your mind now?" }]);
    setSessionId(null);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 dark:bg-slate-950 flex flex-col">
      <div className="container mx-auto max-w-6xl flex-1 flex flex-col py-12 px-4">
        
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6"
            >
                <div className="h-20 w-20 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-primary dark:to-rose-600 flex items-center justify-center shadow-2xl shadow-slate-200 dark:shadow-primary/20 relative group">
                    <Sparkles className="h-10 w-10 text-white animate-pulse" />
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 border-4 border-slate-50 dark:border-slate-950 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white animate-ping" />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-1">
                        Cravely <span className="text-primary italic">Intelligence</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1">
                            System Active
                        </Badge>
                        <span className="text-xs font-bold text-slate-400">Ver 2.0.4</span>
                    </div>
                </div>
            </motion.div>
            
            <div className="flex items-center gap-3">
                <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={clearChat} 
                    className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] gap-2 border-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 h-12 shadow-sm"
                >
                    <Trash2 className="h-4 w-4 text-rose-500" /> Reset Session
                </Button>
                <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] gap-2 border-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 h-12 shadow-sm"
                >
                    <History className="h-4 w-4 text-slate-400" /> Archive
                </Button>
            </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-10 flex-1 items-stretch">
            {/* Intelligent Sidebar */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:flex flex-col gap-6"
            >
                <Card className="p-8 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 dark:border-slate-800">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> Capabilities
                    </h4>
                    <div className="space-y-5">
                        {[
                            { icon: Utensils, text: "Personalized Menus", desc: "Based on your cravings" },
                            { icon: Bot, text: "Dietary Architect", desc: "Calorie & macro advice" },
                            { icon: Info, text: "Kitchen Scout", desc: "Finding the best local chefs" }
                        ].map((cap, i) => (
                            <div key={i} className="group">
                                <div className="flex items-center gap-4 mb-1">
                                    <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <cap.icon className="h-5 w-5" />
                                    </div>
                                    <div className="font-bold text-sm text-slate-700 dark:text-slate-200">{cap.text}</div>
                                </div>
                                <p className="text-[10px] text-slate-400 font-medium pl-14">{cap.desc}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-8 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 group-hover:bg-primary/30 transition-colors blur-3xl rounded-full -mr-20 -mt-20" />
                    <div className="relative z-10">
                        <div className="h-8 w-8 rounded-lg bg-white/10 dark:bg-slate-900/10 flex items-center justify-center mb-4">
                            <Info className="h-4 w-4" />
                        </div>
                        <h4 className="font-black text-sm mb-2">Prompt Tip</h4>
                        <p className="text-xs font-medium opacity-70 leading-relaxed">
                            &quot;Show me the most popular desserts from providers with a 4.5+ rating.&quot;
                        </p>
                    </div>
                </Card>
            </motion.div>

            {/* Chat Command Center */}
            <Card className="lg:col-span-3 min-h-[650px] border-none shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-[3rem] bg-white dark:bg-slate-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-800 overflow-hidden flex flex-col relative">
                <ScrollArea className="flex-1 px-8 py-10" ref={scrollRef}>
                    <div className="space-y-10 pb-4">
                        {messages.map((m, i) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={i} 
                                className={cn(
                                    "flex items-end gap-4",
                                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {m.role === "assistant" && (
                                    <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mb-1 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                                        <Bot className="h-6 w-6 text-primary" />
                                    </div>
                                )}
                                <div className="flex flex-col gap-3 max-w-[80%]">
                                    <div className={cn(
                                        "p-6 rounded-[2rem] text-base leading-relaxed",
                                        m.role === "user" 
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-br-none shadow-2xl shadow-slate-200 dark:shadow-none font-medium" 
                                            : "bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-100 dark:border-slate-800/50"
                                    )}>
                                        {m.content.replace(/<cite\s+id=["'][^"']+["']\s*\/?>/g, "")}
                                    </div>
                                    
                                    {m.citations && m.citations.length > 0 && (
                                        <div className="flex flex-wrap gap-2 px-2 animate-in fade-in slide-in-from-top-2 duration-500">
                                            {m.citations.map((id) => (
                                                <Badge 
                                                    key={id} 
                                                    variant="secondary" 
                                                    className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 font-bold px-4 py-2 rounded-xl shadow-sm hover:border-primary/30 transition-colors cursor-pointer group"
                                                >
                                                    <Utensils className="h-3 w-3 mr-2 text-primary group-hover:scale-110 transition-transform" />
                                                    {id}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50">
                                    <Bot className="h-6 w-6 text-primary animate-pulse" />
                                </div>
                                <div className="flex gap-2 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] rounded-bl-none border border-slate-100 dark:border-slate-800/50">
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="h-2 w-2 rounded-full bg-primary" />
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="h-2 w-2 rounded-full bg-primary" />
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="h-2 w-2 rounded-full bg-primary" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Intelligent Input Hub */}
                <div className="p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/50">
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="relative group"
                    >
                        <Input
                            placeholder="Ask Cravely Intelligence..."
                            className="h-20 pl-10 pr-24 rounded-[2.5rem] border-none bg-slate-50 dark:bg-slate-800/50 focus-visible:ring-2 focus-visible:ring-primary/20 text-lg font-medium placeholder:text-slate-400 dark:text-white"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button 
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || isLoading}
                            className={cn(
                                "absolute right-3 top-1/2 -translate-y-1/2 h-14 w-14 rounded-3xl transition-all duration-300",
                                input.trim() ? "bg-primary text-white shadow-2xl shadow-primary/20 scale-100 rotate-0" : "bg-slate-200 dark:bg-slate-700 text-slate-400 scale-95 opacity-50"
                            )}
                        >
                            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                        </Button>
                    </form>
                    <div className="flex items-center justify-between mt-6 px-4">
                        <div className="flex items-center gap-6 opacity-30">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Gemini 1.5 Flash</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">RAG Pipeline v2</span>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                            FoodHub AI Command Center
                        </p>
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
