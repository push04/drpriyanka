"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase"; // Ensure this matches user's project structure
import { v4 as uuidv4 } from "uuid";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Namaste! I am Dr. Priyanka's virtual assistant. How can I guide you towards wellness today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string>("");

    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial Setup: Get User, Session, and History
    useEffect(() => {
        const initializeChat = async () => {
            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);

            // 2. Get/Set Session ID (for anonymous users)
            let currentSessionId = localStorage.getItem("chat_session_id");
            if (!currentSessionId) {
                currentSessionId = uuidv4();
                localStorage.setItem("chat_session_id", currentSessionId);
            }
            setSessionId(currentSessionId);

            // 3. Load History
            // We only look back 24 hours for relevance, or last 50 messages
            const { data: history, error } = await supabase
                .from('chat_logs')
                .select('role, content')
                .or(`user_id.eq.${user?.id},session_id.eq.${currentSessionId}`)
                .order('created_at', { ascending: true })
                .limit(50);

            if (history && history.length > 0) {
                // Determine if we need to add the welcome message (if history is empty or old)
                // For simplicity, just append history. If history exists, we replace the default welcome msg? 
                // A nice UX is keeping the welcome message if the last message was > 1 hour ago.
                // For now, just load the history.
                setMessages(history.map(h => ({ role: h.role as "user" | "assistant", content: h.content })));
            }
        };

        initializeChat();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
                    userId: userId,
                    sessionId: sessionId
                }),
            });

            if (!response.ok) throw new Error("Failed to connect to AI");

            const data = await response.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "I apologize, I am having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="mb-4"
                    >
                        <Card className="w-[350px] shadow-2xl border-[#2d5016]/20">
                            {/* Header - Explicitly styled for visibility */}
                            <div className="bg-[#2d5016] p-4 flex justify-between items-center rounded-t-lg shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                        <Bot className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-semibold text-lg text-white">Wellness Assistant</h3>
                                        <p className="text-xs text-white/80 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            Online • Often replies instantly
                                        </p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <CardContent className="h-[400px] overflow-y-auto p-4 bg-[#faf9f6]" ref={scrollRef}>
                                <div className="space-y-4">
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                                    ? 'bg-[#2d5016] text-white rounded-tr-none'
                                                    : 'bg-white border rounded-tl-none shadow-sm'
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border p-3 rounded-lg rounded-tl-none shadow-sm flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin text-[#2d5016]" />
                                                <span className="text-xs text-muted-foreground">Thinking...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="p-3 bg-white border-t">
                                <form
                                    className="flex w-full gap-2"
                                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                                >
                                    <Input
                                        placeholder="Ask about therapies..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="focus-visible:ring-[#2d5016]"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="bg-[#2d5016] hover:bg-[#2d5016]/90"
                                        disabled={isLoading || !input.trim()}
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="bg-[#2d5016] hover:bg-[#2d5016]/90 text-white p-4 rounded-full shadow-lg flex items-center justify-center relative"
                >
                    <MessageCircle className="w-6 h-6" />
                    {/* Notification dot if user hasn't opened yet? Maybe later */}
                </motion.button>
            )}
        </div>
    );
}
