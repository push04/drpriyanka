"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] p-4">
            <div className="text-center space-y-6 max-w-md bg-white p-8 rounded-xl shadow-lg">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900">Something went wrong!</h2>
                    <p className="text-muted-foreground mt-2">
                        We apologize for the inconvenience. Our team has been notified.
                    </p>
                </div>
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => reset()} className="bg-[#2d5016] hover:bg-[#2d5016]/90">
                        Try again
                    </Button>
                    <Button onClick={() => window.location.href = "/"} variant="outline">
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
