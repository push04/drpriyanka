"use client";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <Navbar />
            <div className="container mx-auto px-6 md:px-12 lg:px-24 py-24">
                <h1 className="text-4xl font-serif font-bold text-[#2d5016] mb-8">Privacy Policy</h1>
                <div className="prose prose-lg max-w-none text-[#1f2937]">
                    <p className="mb-4">Last Updated: January 2026</p>
                    <p className="mb-6">
                        At Dr. Priyanka's Naturopathy Clinic, we are committed to protecting your privacy and ensuring the security of your personal health information. This Privacy Policy outlines how we collect, use, and safeguard your data.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-[#2d5016] mt-8 mb-4">1. Information We Collect</h2>
                    <p className="mb-4">
                        We collect personal information that you provide to us directly, such as when you book an appointment, fill out a contact form, or register as a patient. This may include your name, email address, phone number, medical history, and payment details.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-[#2d5016] mt-8 mb-4">2. How We Use Your Information</h2>
                    <p className="mb-4">
                        We use your information to provide and improve our services, including:
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                            <li>Processing appointment bookings and payments.</li>
                            <li>Providing personalized medical consultations and treatments.</li>
                            <li>Sending appointment reminders and clinic updates.</li>
                            <li>Improving our website and user experience.</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-[#2d5016] mt-8 mb-4">3. Data Security</h2>
                    <p className="mb-4">
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                    </p>

                    <h2 className="text-2xl font-serif font-bold text-[#2d5016] mt-8 mb-4">4. Contact Us</h2>
                    <p className="mb-4">
                        If you have any questions about this Privacy Policy, please contact us at:
                        <br />
                        <strong>Email:</strong> clinic@drpriyanka.com
                        <br />
                        <strong>Address:</strong> 123 Wellness Ave, Alkapuri, Vadodara, Gujarat 390007
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
