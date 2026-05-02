"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Loader2, Bot, Trash2, History, Utensils, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/providers/auth-provider";
import { ApiResponse } from "@/types";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: any[];
}

interface ChatResponse {
  message: string;
  sessionId: string;
  citations: any[];
}

export default function CravelyPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Welcome to the full Cravely experience. I'm here to help you navigate the world of FoodHub. Ask me anything about meals, providers, or even culinary advice!" }
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
  }, [messages]);

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
        setMessages(prev => [...prev, { 
            role: "assistant", 
            content: res.data.message,
            citations: res.data.citations
        }]);
        setSessionId(res.data.sessionId);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting to my culinary brain. Give me a second and try again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "Chat cleared. What's on your mind now?" }]);
    setSessionId(null);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50/50 flex flex-col">
      <div className="container mx-auto max-w-5xl flex-1 flex flex-col py-8 px-4">
        
        {/* Header Area */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-[1.5rem] bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                    <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Cravely <span className="text-primary">AI</span></h1>
                    <p className="text-sm font-medium text-slate-500">Your AI-powered Gourmet Assistant</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={clearChat} className="rounded-xl font-bold text-xs uppercase tracking-widest gap-2">
                    <Trash2 className="h-3.5 w-3.5" /> Clear
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs uppercase tracking-widest gap-2">
                    <History className="h-3.5 w-3.5" /> History
                </Button>
            </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 flex-1 items-start">
            {/* Sidebar info */}
            <div className="hidden lg:block space-y-6">
                <Card className="p-6 border-none shadow-xl shadow-slate-100 rounded-[2rem] bg-white">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 flex items-center gap-2">
                        <Info className="h-4 w-4" /> Capabilities
                    </h4>
                    <ul className="space-y-4">
                        {[
                            { icon: Utensils, text: "Meal Recommendations" },
                            { icon: Bot, text: "Dietary Advice" },
                            { icon: Info, text: "Order Support" }
                        ].map((cap, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center">
                                    <cap.icon className="h-4 w-4 text-slate-400" />
                                </div>
                                {cap.text}
                            </li>
                        ))}
                    </ul>
                </Card>

                <Card className="p-6 border-none shadow-xl shadow-slate-100 rounded-[2rem] bg-primary text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
                    <h4 className="text-sm font-black mb-2 relative z-10">Pro Tip</h4>
                    <p className="text-xs font-medium text-white/80 leading-relaxed relative z-10">
                        Try asking: "What's the best spicy Biriyani under 500 BDT?"
                    </p>
                </Card>
            </div>

            {/* Chat Area */}
            <Card className="lg:col-span-3 h-[70vh] border-none shadow-2xl shadow-slate-200 rounded-[3rem] bg-white overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-8" ref={scrollRef}>
                    <div className="space-y-8 pb-4">
                        {messages.map((m, i) => (
                            <div 
                                key={i} 
                                className={cn(
                                    "flex flex-col",
                                    m.role === "user" ? "items-end" : "items-start"
                                )}
                            >
                                <div className={cn(
                                    "max-w-[80%] p-6 rounded-[2rem] text-sm md:text-base font-medium leading-relaxed shadow-sm",
                                    m.role === "user" 
                                        ? "bg-slate-900 text-white rounded-tr-none" 
                                        : "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100"
                                )}>
                                    {m.content}
                                </div>
                                {m.citations && m.citations.length > 0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <span className="text-[10px] font-black uppercase text-slate-400 w-full mb-1">Cravely suggests:</span>
                                        {m.citations.map((c: any) => (
                                            <Badge key={c.id} variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-bold px-3 py-1">
                                                {c.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                </div>
                                <span className="text-sm font-bold text-slate-400 italic">Thinking...</span>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-6 bg-slate-50/50 border-t">
                    <form 
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="relative flex items-center gap-4"
                    >
                        <div className="relative flex-1">
                            <Input
                                placeholder="Message Cravely..."
                                className="h-16 pl-8 pr-16 rounded-[2rem] border-none shadow-inner bg-white focus-visible:ring-primary/20 text-lg font-medium"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button 
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-2xl shadow-xl shadow-primary/20 transition-transform active:scale-90"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </form>
                    <p className="text-[10px] text-center text-slate-400 mt-4 font-black uppercase tracking-widest">
                        Always verify AI-generated information. Powered by Google Gemini.
                    </p>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
