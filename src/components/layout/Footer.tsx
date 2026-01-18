import Link from "next/link";
import { Leaf, Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
    return (
        <footer className="bg-[#2d5016] text-white pt-16 pb-8">
            <div className="container mx-auto px-6 md:px-16 lg:px-32">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-white/10 p-2 rounded-full">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-serif font-bold text-white">
                                Dr. Priyanka.Clinic
                            </span>
                        </Link>
                        <p className="text-white/80 text-sm leading-relaxed">
                            Restoring health naturally through the ancient wisdom of Nature Cure and modern holistic practices.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-white/70 hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-white/70 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-white/70 hover:text-white transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/services" className="text-white/70 hover:text-white">Our Services</Link></li>
                            <li><Link href="/about" className="text-white/70 hover:text-white">About Dr. Priyanka</Link></li>
                            <li><Link href="/book" className="text-white/70 hover:text-white">Book Appointment</Link></li>
                            <li><Link href="/contact" className="text-white/70 hover:text-white">Contact Us</Link></li>
                            <li><Link href="/patient-portal" className="text-white/70 hover:text-white">Patient Portal</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-white/70">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-white/90 shrink-0" />
                                <span>SF-209, Siddharth Magnum Plus,<br />Next to Bansal Mall, Tarsali-390009</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-white/90 shrink-0" />
                                <div className="flex flex-col">
                                    <span>+91 95862 39293</span>
                                    <span>+91 88664 55269</span>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-white/90 shrink-0" />
                                <span>clinic@drpriyanka.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold mb-4 text-white">Stay Healthy</h3>
                        <p className="text-sm text-white/70 mb-4">
                            Subscribe to our newsletter for health tips and clinic updates.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Input placeholder="Enter your email" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-offset-0 focus-visible:ring-white" />
                            <Button className="bg-[#e07a5f] hover:bg-[#e07a5f]/90 text-white border-none">Subscribe</Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
                    <p>© {new Date().getFullYear()} Dr. Priyanka's Naturopathy Clinic. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
