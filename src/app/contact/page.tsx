"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
                <section className="bg-primary/5 py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Contact Us</h1>
                        <p className="text-muted-foreground">We are here to help you on your journey to wellness.</p>
                    </div>
                </section>

                <section className="py-16 container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-serif font-bold">Get in Touch</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full"><MapPin className="text-primary" /></div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Visit Us</h3>
                                        <p className="text-muted-foreground">SF-209, Siddharth Magnum Plus,<br />Next to Bansal Mall, Tarsali-390009</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full"><Phone className="text-primary" /></div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Call Us</h3>
                                        <p className="text-muted-foreground">+91 95862 39293</p>
                                        <p className="text-muted-foreground">+91 88664 55269</p>
                                        <div className="mt-2 text-sm text-muted-foreground bg-gray-50 p-2 rounded-md border border-gray-100">
                                            <p><span className="font-semibold text-[#2d5016]">Morning:</span> 11:00 AM - 01:00 PM</p>
                                            <p><span className="font-semibold text-[#2d5016]">Evening:</span> 06:00 PM - 08:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/10 p-3 rounded-full"><Mail className="text-primary" /></div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Email Us</h3>
                                        <p className="text-muted-foreground">clinic@drpriyanka.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <Card className="p-8 shadow-lg border-none">
                            {isSuccess ? (
                                <div className="text-center py-12 space-y-4">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                        <Clock className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-[#2d5016]">Message Sent!</h3>
                                    <p className="text-muted-foreground">
                                        Thank you for reaching out. We will get back to you within 24 hours.
                                    </p>
                                    <Button onClick={() => setIsSuccess(false)} variant="outline">
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">First Name</label>
                                            <Input placeholder="Jane" required disabled={isSubmitting} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Last Name</label>
                                            <Input placeholder="Doe" required disabled={isSubmitting} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email</label>
                                        <Input type="email" placeholder="jane@example.com" required disabled={isSubmitting} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Message</label>
                                        <Textarea
                                            placeholder="How can we help you?"
                                            className="min-h-[120px]"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </Button>
                                </form>
                            )}
                        </Card>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
