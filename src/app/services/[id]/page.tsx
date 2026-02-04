import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, CheckCircle } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { createClient } from '@supabase/supabase-js';

// We need a server-side client or just use the public URL/Anon key directly for public data
// Since this is a server component, we can create a quick client instance
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: service, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !service) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
                <Link href="/services" className="text-primary hover:underline">Back to Services</Link>
            </div>
        </div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-20">
                <div className="relative h-[400px] w-full">
                    <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto text-white">
                        <div className="text-sm font-bold uppercase tracking-widest bg-primary/80 inline-block px-3 py-1 rounded-sm mb-4">
                            {service.category}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold">{service.name}</h1>
                    </div>
                </div>

                <div className="container mx-auto px-6 md:px-16 lg:px-32 py-12 grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                        <h2 className="text-2xl font-serif font-bold text-primary">About this Therapy</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {service.description}
                            {" "}
                            This holistic treatment involves a comprehensive approach to healing, focusing not just on symptoms but on the root cause of imbalance in the body.
                        </p>

                        <div className="space-y-4">
                            <h3 className="font-bold text-xl">Benefits</h3>
                            <ul className="space-y-2">
                                {[1, 2, 3, 4].map(i => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                        <CheckCircle className="w-5 h-5 text-secondary" />
                                        <span>Restores natural balance and energy levels</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 border rounded-xl shadow-sm bg-card sticky top-24">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-muted-foreground">Price per session</span>
                                <span className="text-3xl font-bold text-primary">₹{service.price}</span>
                            </div>

                            <div className="flex items-center gap-3 mb-8 text-muted-foreground">
                                <Clock className="w-5 h-5" />
                                <span>{service.duration} Duration</span>
                            </div>

                            <Button className="w-full h-12 text-lg mb-4" asChild>
                                <Link href={`/book?service=${service.id}`}>Book Appointment</Link>
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                Free cancellation up to 24 hours before appointment.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
