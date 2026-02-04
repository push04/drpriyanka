"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess(false);

        try {
            // Include the redirect URL to the update password page
            const redirectUrl = `${window.location.origin}/auth/callback?next=/auth/update-password`;

            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: redirectUrl,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send reset email");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] p-4">
            <Card className="w-full max-w-md shadow-xl border-none">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto bg-[#2d5016]/10 w-16 h-16 rounded-full flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-[#2d5016]" />
                    </div>
                    <CardTitle className="text-2xl font-serif font-bold text-[#2d5016]">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="space-y-6">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3 items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                                <div>
                                    <h5 className="font-medium text-green-800 mb-1">Check your email</h5>
                                    <div className="text-sm text-green-700">
                                        We have sent a password reset link to <strong>{email}</strong>.
                                    </div>
                                </div>
                            </div>
                            <Button asChild className="w-full bg-[#2d5016] hover:bg-[#2d5016]/90 text-white">
                                <Link href="/login">Return to Login</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
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
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
                            </Button>
                        </form>
                    )}
                </CardContent>
                {!success && (
                    <CardFooter className="justify-center">
                        <Link href="/login" className="flex items-center text-sm text-muted-foreground hover:text-[#2d5016] transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Link>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
