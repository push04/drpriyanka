"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    const scrollRef = useRef<HTMLDivElement>(null);

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
                    messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
                }),
            });

            if (!response.ok) throw new Error("Failed to correct AI");

            const data = await response.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
        } catch (error) {
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
                            <CardHeader className="bg-[#2d5016] text-white rounded-t-lg p-4 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bot className="w-6 h-6" />
                                    <div>
                                        <CardTitle className="text-lg font-serif">Wellness Assistant</CardTitle>
                                        <p className="text-xs text-white/80">Online • Typically replies instantly</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-white hover:bg-white/20 h-8 w-8"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </CardHeader>

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
                    className="bg-[#2d5016] hover:bg-[#2d5016]/90 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
                >
                    <MessageCircle className="w-6 h-6" />
                </motion.button>
            )}
        </div>
    );
}
