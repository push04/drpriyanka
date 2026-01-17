"use client";

import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
                {/* Mission */}
                <section className="py-20 container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
                                alt="Doctor"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Dr. Priyanka</h1>
                            <h2 className="text-2xl text-muted-foreground">Chief Naturopath & Founder</h2>
                            <div className="prose prose-lg text-muted-foreground">
                                <p>
                                    With over 10 years of experience in holistic medicine, Dr. Priyanka has dedicated her life to healing patients through the power of nature. She believes that the body has an innate ability to heal itself when provided with the right environment and nutrition.
                                </p>
                                <p>
                                    Her approach combines traditional wisdom of Ayurveda and Naturopathy with modern scientific understanding to treat the root cause of ailments rather than just symptoms.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                                    <div className="font-bold text-2xl text-primary mb-1">BNYS</div>
                                    <div className="text-sm">Bachelor of Naturopathy & Yogic Sciences</div>
                                </div>
                                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                                    <div className="font-bold text-2xl text-primary mb-1">M.Sc</div>
                                    <div className="text-sm">Nutrition & Dietetics</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
