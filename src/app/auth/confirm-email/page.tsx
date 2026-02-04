"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";

export default function ConfirmEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] p-4">
            <Card className="w-full max-w-md shadow-xl border-none">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto bg-[#2d5016]/10 w-16 h-16 rounded-full flex items-center justify-center">
                        <Mail className="w-8 h-8 text-[#2d5016]" />
                    </div>
                    <CardTitle className="text-2xl font-serif font-bold text-[#2d5016]">Check your inbox</CardTitle>
                    <CardDescription className="text-base">
                        We've sent a confirmation link to your email address.
                        <br />
                        Please verify your email to access your dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-sm text-amber-800">
                        <p className="font-medium">Can't find the email?</p>
                        <p className="mt-1">Check your spam folder or wait a few minutes.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Link href="/login" className="w-full">
                        <Button variant="outline" className="w-full border-[#2d5016] text-[#2d5016] hover:bg-[#2d5016]/5">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
