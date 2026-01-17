"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

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
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-20">
                <section className="bg-muted/30 py-16 md:py-24">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Our Treatments</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Explore our range of natural therapies designed to restore vitality and wellness.
                        </p>
                    </div>
                </section>

                <section className="py-16 md:py-24 container mx-auto px-4 md:px-6">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {services.map((service) => (
                            <motion.div key={service.id} variants={fadeIn}>
                                <Card hoverEffect className="h-full flex flex-col overflow-hidden border-none shadow-md group">
                                    <div className="relative h-64 w-full overflow-hidden">
                                        <Image
                                            src={service.image}
                                            alt={service.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                    <CardContent className="flex-grow p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-xs font-semibold text-accent uppercase tracking-wider">{service.category}</div>
                                            <div className="text-lg font-bold text-primary">₹{service.price}</div>
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">{service.name}</h3>
                                        <p className="text-muted-foreground text-sm line-clamp-3">{service.description}</p>
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
                </section>
            </main>

            <Footer />
        </div>
    );
}
