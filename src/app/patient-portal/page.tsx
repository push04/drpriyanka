"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function PatientPortalLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login delay
        router.push("/patient-dashboard");
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <Navbar />
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-6">
                <Card className="w-full max-w-md shadow-lg border-0 bg-white">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-serif font-bold text-[#2d5016]">Patient Portal</CardTitle>
                        <CardDescription>
                            Access your appointments, medical records, and prescriptions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="text-sm text-[#2d5016] hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-[#2d5016] hover:bg-[#2d5016]/90 text-white">
                                Sign In
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 text-center">
                        <div className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/book" className="text-[#2d5016] font-medium hover:underline">
                                Book an appointment to register
                            </Link>
                        </div>
                        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-md w-full">
                            <strong>Demo Credentials:</strong><br />
                            You can click Sign In with any credentials to test the UI.
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <Footer />
        </div>
    );
}
