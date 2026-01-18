"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Loader2 } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Service type for database services
interface Service {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: string;
    category?: string;
    status?: string;
}

function BookingForm() {
    const searchParams = useSearchParams();
    const preSelectedServiceId = searchParams.get("service");
    const { user, isLoading } = useAuth();

    // Services from database
    const [services, setServices] = useState<Service[]>([]);
    const [servicesLoading, setServicesLoading] = useState(true);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        serviceId: preSelectedServiceId || "",
        date: "",
        time: "",
        name: "",
        email: "",
        phone: "",
        recurrence: "none",
        sessions: 1
    });

    // Fetch services from database
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('/api/admin/services');
                const data = await response.json();
                if (response.ok && data.services) {
                    // Filter active services only
                    const activeServices = data.services.filter((s: Service) =>
                        s.status === 'active' || !s.status
                    );
                    setServices(activeServices);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setServicesLoading(false);
            }
        };
        fetchServices();
    }, []);

    // Auto-fill user details when authenticated
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.user_metadata?.full_name || "",
                email: user.email || ""
            }));
        }
    }, [user]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const selectedService = services.find((s: Service) => s.id === formData.serviceId);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const response = await fetch('/api/appointments/book', {
                method: 'POST',
                headers,
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Submission failed');
            }

            setIsSubmitting(false);
            setIsSuccess(true);
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
            setIsSubmitting(false);
        }
    };

    // 1. Loading State
    if (isLoading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    // 2. Auth Requirement Prompt
    if (!user) {
        return (
            <Card className="max-w-md mx-auto p-8 text-center shadow-lg border-t-4 border-t-[#2d5016]">
                <div className="bg-[#2d5016]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-[#2d5016]" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#2d5016] mb-3">Login Required</h2>
                <p className="text-muted-foreground mb-8">
                    To ensure the best care and keep track of your health journey, please log in or create an account to book an appointment.
                </p>
                <div className="flex flex-col gap-3">
                    <Button asChild size="lg" className="w-full">
                        <Link href={`/login?redirect=/book${preSelectedServiceId ? `?service=${preSelectedServiceId}` : ''}`}>Log In</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full">
                        <Link href="/signup">Create Account</Link>
                    </Button>
                </div>
            </Card>
        );
    }

    if (isSuccess) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-4">
                    Booking Confirmed!
                </h2>
                <p className="text-muted-foreground mb-8">
                    Thank you {formData.name}. We have sent a confirmation email to {formData.email}.
                    {formData.recurrence !== 'none' && (
                        <span className="block mt-2 font-medium">This is a persistent {formData.recurrence} booking for {formData.sessions} sessions.</span>
                    )}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="bg-[#2d5016]">
                        <Link href="/patient-dashboard/profile">Complete Health Profile</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/patient-dashboard">Go to Dashboard</Link>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-4 max-w-sm mx-auto">
                    Filling out your health profile now helps Dr. Priyanka prepare for your session effectively.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Steps Indicator */}
            <div className="flex items-center justify-center mb-12 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -z-10" />
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-background border-2 mx-8 transition-colors",
                            step >= s ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground"
                        )}
                    >
                        {s}
                    </div>
                ))}
            </div>

            <Card className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-2xl font-serif font-bold mb-6">Select a Service</h2>
                            {servicesLoading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : services.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No services available at the moment.</p>
                                    <p className="text-sm mt-2">Please contact the clinic directly.</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {services.map((service: Service) => (
                                        <div
                                            key={service.id}
                                            onClick={() => setFormData({ ...formData, serviceId: service.id })}
                                            className={cn(
                                                "cursor-pointer border rounded-lg p-4 transition-all hover:border-primary",
                                                formData.serviceId === service.id ? "border-primary bg-primary/5 ring-1 ring-primary" : ""
                                            )}
                                        >
                                            <div className="font-bold">{service.name}</div>
                                            <div className="text-sm text-muted-foreground">{service.duration} • ₹{service.price}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-8 flex justify-end">
                                <Button onClick={handleNext} disabled={!formData.serviceId}>
                                    Next Step <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-2xl font-serif font-bold mb-6">Choose Date & Time</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="font-medium">Select Date</label>
                                    <Input
                                        type="date"
                                        className="w-full"
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        value={formData.date}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="font-medium">Select Time</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time) => (
                                            <div
                                                key={time}
                                                onClick={() => setFormData({ ...formData, time })}
                                                className={cn(
                                                    "border rounded-md py-2 text-center text-sm cursor-pointer hover:border-primary",
                                                    formData.time === time ? "bg-primary text-primary-foreground border-primary" : ""
                                                )}
                                            >
                                                {time}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recurrence Options */}
                                <div className="space-y-4 md:col-span-2 border-t pt-4 mt-4">
                                    <h3 className="font-medium text-primary">Recurring Sessions (Optional)</h3>
                                    <div className="flex flex-wrap gap-4">
                                        <div
                                            onClick={() => setFormData({ ...formData, recurrence: 'none', sessions: 1 })}
                                            className={cn("border px-4 py-2 rounded cursor-pointer", formData.recurrence === 'none' ? "bg-primary text-white border-primary" : "bg-white hover:border-primary")}
                                        >
                                            Single Session
                                        </div>
                                        <div
                                            onClick={() => setFormData({ ...formData, recurrence: 'weekly', sessions: 4 })}
                                            className={cn("border px-4 py-2 rounded cursor-pointer", formData.recurrence === 'weekly' ? "bg-primary text-white border-primary" : "bg-white hover:border-primary")}
                                        >
                                            Weekly (4 Sessions)
                                        </div>
                                        <div
                                            onClick={() => setFormData({ ...formData, recurrence: 'monthly', sessions: 3 })}
                                            className={cn("border px-4 py-2 rounded cursor-pointer", formData.recurrence === 'monthly' ? "bg-primary text-white border-primary" : "bg-white hover:border-primary")}
                                        >
                                            Monthly (3 Sessions)
                                        </div>
                                    </div>
                                    {formData.recurrence !== 'none' && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            This will book {formData.sessions} sessions starting from {formData.date || "selected date"}.
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8 flex justify-between">
                                <Button variant="outline" onClick={handleBack}>Back</Button>
                                <Button onClick={handleNext} disabled={!formData.date || !formData.time}>
                                    Next Step <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-2xl font-serif font-bold mb-6">Your Details</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            readOnly={!!user}
                                            className={user ? "bg-muted/50" : ""}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Phone Number</label>
                                        <Input
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address</label>
                                    <Input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        readOnly={!!user}
                                        className={user ? "bg-muted/50" : ""}
                                    />
                                </div>

                                <div className="bg-muted/30 p-4 rounded-lg mt-6 space-y-2">
                                    <h3 className="font-bold">Booking Summary</h3>
                                    <div className="flex justify-between text-sm">
                                        <span>Service:</span>
                                        <span className="font-medium">{selectedService?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Date & Time:</span>
                                        <span className="font-medium">{formData.date} at {formData.time}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Type:</span>
                                        <span className="font-medium capitalize">{formData.recurrence === 'none' ? 'Single Session' : `${formData.recurrence} (${formData.sessions} sessions)`}</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t">
                                        <span>Total:</span>
                                        <span className="font-bold text-primary">
                                            ₹{(selectedService?.price || 0) * formData.sessions}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-between">
                                    <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
                                    <Button type="submit" size="lg" disabled={isSubmitting}>
                                        {isSubmitting ? "Processing..." : "Confirm Booking"}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </div>
    );
}

export default function BookingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-muted/10">
            <Navbar />
            <main className="flex-grow pt-28 pb-16 container mx-auto px-6 md:px-16 lg:px-32">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8">Book Your Appointment</h1>
                <Suspense fallback={<div>Loading...</div>}>
                    <BookingForm />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
