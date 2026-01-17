"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <Navbar />
            <div className="container mx-auto px-6 md:px-12 lg:px-24 py-24">
                <h1 className="text-4xl font-serif font-bold text-[#2d5016] mb-8">Terms of Service</h1>
                <div className="prose prose-lg max-w-none text-[#1f2937]">
                    <p className="mb-4">Last Updated: January 2026</p>
                    <p className="mb-6">
                        Welcome to Dr. Priyanka's Naturopathy Clinic. By accessing or using our website and services, you agree to be bound by these Terms of Service.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-[#2d5016] mt-8 mb-4">1. Medical Disclaimer</h2>
                    <p className="mb-4">
                        The content on this website is for informational purposes only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-[#2d5016] mt-8 mb-4">2. Appointment Policies</h2>
                    <p className="mb-4">
                        Please arrive at least 10 minutes before your scheduled appointment time. Cancellations must be made at least 24 hours in advance to avoid a cancellation fee.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-[#2d5016] mt-8 mb-4">3. Use of Services</h2>
                    <p className="mb-4">
                        You agree to use our services only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use and enjoyment of the services.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-[#2d5016] mt-8 mb-4">4. Intellectual Property</h2>
                    <p className="mb-4">
                        All content on this website, including text, graphics, logos, and images, is the property of Dr. Priyanka's Naturopathy Clinic and is protected by copyright laws.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-[#2d5016] mt-8 mb-4">5. Changes to Terms</h2>
                    <p className="mb-4">
                        We reserve the right to modify these terms at any time. Your continued use of the site constitutes acceptance of the updated terms.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
