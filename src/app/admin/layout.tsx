"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    LogOut,
    Leaf,
    Stethoscope,
    Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Appointments", href: "/admin/appointments", icon: Calendar },
    { name: "Patients", href: "/admin/patients", icon: Users },
    { name: "Services", href: "/admin/services", icon: Stethoscope },
    { name: "Invoices", href: "/admin/invoices", icon: Receipt },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    React.useEffect(() => {
        // Skip check on login page itself to prevent loop
        if (pathname === "/admin/login") return;

        const session = localStorage.getItem("admin_session");
        if (!session) {
            router.push("/admin/login");
        }
    }, [pathname, router]);

    // If on login page, render without sidebar layout
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-muted/20 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-primary-foreground hidden md:flex flex-col flex-shrink-0 fixed h-full shadow-xl z-20">
                <div className="p-6 flex items-center gap-2 border-b border-white/10">
                    <Leaf className="w-6 h-6" />
                    <span className="font-serif font-bold text-xl">Admin Portal</span>
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
                                        ? "bg-white/20 text-white font-medium shadow-sm"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {link.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => {
                            localStorage.removeItem("admin_session");
                            router.push("/admin/login");
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <header className="h-16 bg-background border-b flex items-center justify-between px-6 sticky top-0 z-10">
                    <h1 className="font-semibold text-lg">
                        {sidebarLinks.find(l => l.href === pathname)?.name || "Overview"}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            AD
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
