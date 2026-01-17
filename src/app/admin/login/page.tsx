"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (username === "admin" && password === "priyanka") {
            // Set mock session
            localStorage.setItem("admin_session", "true");
            router.push("/admin");
        } else {
            setError("Invalid credentials. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#2d5016]/5 p-4">
            <Card className="w-full max-w-md shadow-2xl border-0">
                <CardHeader className="text-center space-y-4 pb-2">
                    <div className="mx-auto bg-[#2d5016]/10 w-16 h-16 rounded-full flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-[#2d5016]" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-serif font-bold text-[#2d5016]">Admin Portal</CardTitle>
                        <CardDescription>
                            Dr. Priyanka's Naturopathy Clinic
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <div className="relative">
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                                <div className="absolute left-3 top-2.5 text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    // Suggesting the password in placeholder for demo convenience, or keeping it dots
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-[#2d5016] hover:bg-[#2d5016]/90 text-white h-11"
                            disabled={isLoading}
                        >
                            {isLoading ? "Authenticating..." : (
                                <span className="flex items-center gap-2">
                                    Sign In <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center text-xs text-muted-foreground pb-6">
                    Authorized personnel only. <br /> Access is monitored and logged.
                </CardFooter>
            </Card>
        </div>
    );
}
