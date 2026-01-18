"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { services } from "@/lib/data";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ServicesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ServicesContent />
        </Suspense>
    );
}

function ServicesContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const [filteredServices, setFilteredServices] = useState(services);

    useEffect(() => {
        if (query) {
            const lowerQuery = query.toLowerCase();
            const results = services.filter(service =>
                service.name.toLowerCase().includes(lowerQuery) ||
                service.description.toLowerCase().includes(lowerQuery) ||
                service.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
                service.category.toLowerCase().includes(lowerQuery)
            );
            setFilteredServices(results);
        } else {
            setFilteredServices(services);
        }
    }, [query]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-20">
                <section className="bg-muted/30 py-16 md:py-24">
                    <div className="container mx-auto px-6 md:px-16 lg:px-32 text-center">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Our Treatments</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Explore our range of natural therapies designed to restore vitality and wellness.
                        </p>

                        {query && (
                            <div className="mt-8">
                                <p className="text-lg mb-4">
                                    Showing treatments for: <span className="font-bold text-primary">"{query}"</span>
                                </p>
                                <Button variant="outline" asChild>
                                    <Link href="/services">View All Treatments</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                <section className="py-16 md:py-24 container mx-auto px-6 md:px-16 lg:px-32">
                    {filteredServices.length > 0 ? (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {filteredServices.map((service) => (
                                <motion.div key={service.id} variants={fadeIn}>
                                    <Card hoverEffect className="h-full flex flex-col overflow-hidden border-none shadow-md group cursor-pointer transition-all hover:shadow-xl">
                                        <Link href={`/services/${service.id}`} className="block h-64 w-full relative overflow-hidden">
                                            <Image
                                                src={service.image}
                                                alt={service.name}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        </Link>
                                        <CardContent className="flex-grow p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="text-xs font-semibold text-accent uppercase tracking-wider">{service.category}</div>
                                                <div className="text-lg font-bold text-primary">₹{service.price}</div>
                                            </div>
                                            <Link href={`/services/${service.id}`} className="group-hover:text-primary transition-colors">
                                                <h3 className="text-2xl font-serif font-bold mb-3">{service.name}</h3>
                                            </Link>
                                            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{service.description}</p>

                                            {/* Tags Display */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {service.tags?.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} className="text-[10px] bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {service.tags && service.tags.length > 3 && (
                                                    <span className="text-[10px] bg-muted px-2 py-1 rounded-full text-muted-foreground">+{service.tags.length - 3} more</span>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-6 pt-0 flex justify-between items-center bg-muted/20 border-t border-border/50 mt-auto">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {service.duration}
                                            </div>
                                            <Button asChild size="sm">
                                                <Link href={`/book?service=${service.id}`}>Book Now</Link>
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-serif text-muted-foreground mb-4">No specific therapies found for "{query}".</h3>
                            <p className="text-muted-foreground mb-8">However, our consultation can address almost any condition.</p>
                            <Button asChild size="lg">
                                <Link href="/book">Book General Consultation</Link>
                            </Button>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
