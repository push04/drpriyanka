"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const pathname = usePathname();
    const { user, isAdmin, signOut } = useAuth(); // Integrated Auth

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        await signOut();
        setIsOpen(false);
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-[#faf9f6]/95 backdrop-blur-md border-b border-[#e5e7eb] shadow-sm py-2"
                    : "bg-transparent py-4"
            )}
        >
            <div className="container mx-auto px-6 md:px-16 lg:px-32 h-24 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-[#2d5016]/10 p-2.5 rounded-full group-hover:bg-[#2d5016]/20 transition-colors">
                        <Leaf className="w-6 h-6 text-[#2d5016]" />
                    </div>
                    <span className="text-xl md:text-2xl font-serif font-bold text-[#1f2937] tracking-tight">
                        Dr. Priyanka
                        <span className="text-[#2d5016]">.Clinic</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary relative",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <motion.div
                                    layoutId="navbar-indicator"
                                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3 ml-4">
                        {user ? (
                            <>
                                <Link
                                    href={isAdmin ? "/admin" : "/patient-dashboard"}
                                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {isAdmin ? "Admin Panel" : "My Dashboard"}
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-muted-foreground hover:text-red-600"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button asChild variant="ghost" size="sm" className="hidden lg:flex">
                                <Link href="/login">Login</Link>
                            </Button>
                        )}

                        <Button asChild size="sm" className={cn(user ? "hidden lg:flex" : "")}>
                            <Link href="/book">Book Appointment</Link>
                        </Button>
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t bg-background"
                    >
                        <div className="container px-6 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "text-lg font-medium py-2 border-b border-border/50",
                                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 flex flex-col gap-3">
                                {user ? (
                                    <>
                                        <Link
                                            href={isAdmin ? "/admin" : "/patient-dashboard"}
                                            onClick={() => setIsOpen(false)}
                                            className="text-lg font-medium py-2 text-primary"
                                        >
                                            {isAdmin ? "Admin Dashboard" : "My Dashboard"}
                                        </Link>
                                        <Button variant="outline" onClick={handleLogout} className="w-full">
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href="/login" onClick={() => setIsOpen(false)}>Login / Register</Link>
                                    </Button>
                                )}
                                <Button asChild className="w-full">
                                    <Link href="/book" onClick={() => setIsOpen(false)}>Book Appointment</Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
