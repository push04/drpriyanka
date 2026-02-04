"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Loader2, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if we have an active session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setError("Invalid or expired reset link. Please try again.");
            }
        };
        checkSession();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccess(true);

            // Redirect after a short delay
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update password");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] p-4">
                <Card className="w-full max-w-md shadow-xl border-none">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <CardTitle className="text-xl text-green-800">Password Updated!</CardTitle>
                        <CardDescription>
                            Your password has been successfully changed. Redirecting to login...
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            className="w-full bg-[#2d5016] hover:bg-[#2d5016]/90 text-white"
                            onClick={() => router.push("/login")}
                        >
                            Go to Login Now
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] p-4">
            <Card className="w-full max-w-md shadow-xl border-none">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto bg-[#2d5016]/10 w-16 h-16 rounded-full flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-[#2d5016]" />
                    </div>
                    <CardTitle className="text-2xl font-serif font-bold text-[#2d5016]">Set New Password</CardTitle>
                    <CardDescription>
                        Create a strong password for your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10"
                                />
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="pl-10"
                                />
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-[#2d5016] hover:bg-[#2d5016]/90 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Update Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
