"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    FileText,
    User,
    LogOut,
    Heart
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { name: "Overview", href: "/patient-dashboard", icon: LayoutDashboard },
    { name: "My Appointments", href: "/patient-dashboard/appointments", icon: Calendar },
    { name: "Medical Records", href: "/patient-dashboard/medical-records", icon: FileText },
    { name: "My Profile", href: "/patient-dashboard/profile", icon: User },
];

export default function PatientDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#faf9f6]/50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white hidden md:flex flex-col flex-shrink-0 fixed h-full border-r border-gray-200 z-20">
                <div className="p-6 flex items-center gap-2 border-b border-gray-100">
                    <Heart className="w-6 h-6 text-[#2d5016]" />
                    <span className="font-serif font-bold text-xl text-[#2d5016]">My Wellness</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                                    isActive
                                        ? "bg-[#2d5016] text-white font-medium shadow-md"
                                        : "text-gray-600 hover:bg-[#2d5016]/5 hover:text-[#2d5016]"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link href="/patient-portal" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 w-full transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
                    <h1 className="font-serif font-bold text-xl text-[#2d5016]">
                        {sidebarLinks.find(l => l.href === pathname)?.name || "Welcome Back"}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[#2d5016]/10 flex items-center justify-center text-xs font-bold text-[#2d5016]">
                            JD
                        </div>
                    </div>
                </header>
                <main className="p-6 flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
