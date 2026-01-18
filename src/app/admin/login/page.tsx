"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Lock, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Use server-side API for admin authentication (bypasses RLS issues)
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (data.success && data.session) {
                // Set session in Supabase client for subsequent requests
                await supabase.auth.setSession({
                    access_token: data.session.access_token,
                    refresh_token: data.session.refresh_token
                });

                // Mark admin session
                localStorage.setItem("admin_session", "true");
                localStorage.setItem("admin_name", data.session.user.name);

                router.push("/admin");
            }
        } catch (err: any) {
            setError(err.message || "Invalid credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2d5016]/10 via-white to-[#2d5016]/5 p-4">
            <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/95">
                <CardHeader className="text-center space-y-4 pb-2">
                    <div className="mx-auto bg-gradient-to-br from-[#2d5016] to-[#4a7c28] w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                        <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-serif font-bold text-[#2d5016]">Admin Portal</CardTitle>
                        <CardDescription className="text-[#2d5016]/70">
                            Dr. Priyanka's Naturopathy Clinic
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[#2d5016] font-medium">Username or Email</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-11 border-[#2d5016]/20 focus:border-[#2d5016] focus:ring-[#2d5016]/20"
                                    required
                                />
                                <User className="absolute left-3 top-3 h-4 w-4 text-[#2d5016]/50" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[#2d5016] font-medium">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 h-11 border-[#2d5016]/20 focus:border-[#2d5016] focus:ring-[#2d5016]/20"
                                    required
                                />
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-[#2d5016]/50" />
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg text-center border border-red-200">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#2d5016] to-[#4a7c28] hover:from-[#3d6a1f] hover:to-[#5a8c38] text-white h-12 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center text-center text-xs text-[#2d5016]/60 pb-6 pt-2">
                    <div className="w-12 h-px bg-[#2d5016]/20 mb-4" />
                    <p>Authorized personnel only.</p>
                    <p className="mt-1">Access is monitored and logged.</p>
                </CardFooter>
            </Card>
        </div>
    );
}
