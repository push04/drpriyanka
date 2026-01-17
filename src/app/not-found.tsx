"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-[#faf9f6]">
            <Navbar />
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-24 h-24 bg-[#2d5016]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Leaf className="w-12 h-12 text-[#2d5016]" />
                    </div>
                    <h1 className="text-6xl font-serif font-bold text-[#2d5016]">404</h1>
                    <h2 className="text-2xl font-serif font-medium text-gray-800">Page Not Found</h2>
                    <p className="text-muted-foreground">
                        The path to wellness you are looking for seems to have wandered off. Let's get you back on track.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button asChild className="bg-[#2d5016] hover:bg-[#2d5016]/90">
                            <Link href="/">Return Home</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/contact">Contact Us</Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
