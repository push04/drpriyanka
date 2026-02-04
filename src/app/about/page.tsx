"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

interface SiteSettings {
    about_title?: string;
    about_subtitle?: string;
    about_description?: string;
    about_mission?: string;
}

interface Condition {
    name: string;
    service_id?: string;
}

export default function AboutPage() {
    const [settings, setSettings] = useState<SiteSettings>({});
    const [conditions, setConditions] = useState<(string | Condition)[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsRes, conditionsRes] = await Promise.all([
                    fetch('/api/settings'),
                    fetch('/api/admin/conditions')
                ]);

                const settingsData = await settingsRes.json();
                const conditionsData = await conditionsRes.json();

                if (settingsData.settings) {
                    setSettings(settingsData.settings);
                }

                if (conditionsData.conditions && conditionsData.conditions.length > 0) {
                    setConditions(conditionsData.conditions);
                } else {
                    // Fallback to default conditions
                    setConditions([
                        "Chronic Cold (Sinus)", "Asthma", "Chronic Cough", "Cervical Spondylitis",
                        "Back Pain", "Knee Pain", "Frozen Shoulder", "Skin Diseases",
                        "Increased Immunity", "Acidity", "Constipation", "Weight Loss",
                        "Facial Rejuvenation", "PCOD", "Diabetes", "Hypertension",
                        "Menstrual Disorder", "Thyroid", "Anxiety", "Stress", "Headache"
                    ]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-20">
                {/* Mission */}
                <section className="py-20 container mx-auto px-6 md:px-16 lg:px-32">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://lh3.googleusercontent.com/p/AF1QipNFSsD9RIzrM6EhtktG5TYo1-Ma5UoBYAVSbYBb=s1360-w1360-h1020-rw"
                                alt="Dr. Priyanka Clinic Signboard"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
                                        {settings.about_title || "Dr. Priyanka"}
                                    </h1>
                                    <h2 className="text-2xl text-muted-foreground">
                                        {settings.about_subtitle || "Naturopathy & Herbal Medicine"}
                                    </h2>
                                    <div className="prose prose-lg text-muted-foreground">
                                        <p>
                                            {settings.about_description || "At Dr. Priyanka Clinic & Institute, we provide alternative, safe, and effective treatments through the natural way. Dr. Priyanka specializes in treating chronic ailments by combining the ancient wisdom of Naturopathy with herbal medicine."}
                                        </p>
                                        <p>
                                            {settings.about_mission || "Our goal is to restore health naturally, boosting immunity and revitalizing the body without harmful side effects."}
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
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* TREATMENTS LIST */}
                <section className="py-16 bg-[#faf9f6]">
                    <div className="container mx-auto px-4 md:px-6 text-center">
                        <h2 className="text-3xl font-serif font-bold text-[#2d5016] mb-8">Treatments Available</h2>
                        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                            {conditions.map((condition, idx) => {
                                const isObject = typeof condition === 'object';
                                const name = isObject ? condition.name : condition;
                                const linkHref = isObject && condition.service_id
                                    ? `/services/${condition.service_id}`
                                    : `/services?q=${encodeURIComponent(name)}`;

                                return (
                                    <Link
                                        key={idx}
                                        href={linkHref}
                                        className="bg-white border border-[#2d5016]/20 text-[#2d5016] px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:bg-[#2d5016] hover:text-white transition-all"
                                    >
                                        {name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
