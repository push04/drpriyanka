"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API
        setTimeout(() => {
            setIsLoading(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Profile Settings</h2>
                <p className="text-muted-foreground">Manage your personal information and preferences.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>This information is shared with your doctor.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 rounded-full bg-[#2d5016]/10 flex items-center justify-center text-3xl font-serif text-[#2d5016]">
                            JD
                        </div>
                        <Button variant="outline" size="sm">Change Avatar</Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input defaultValue="John Doe" className="pl-9" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input defaultValue="john@example.com" className="pl-9" disabled />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input defaultValue="+91 98765 43210" className="pl-9" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Date of Birth</Label>
                            <Input type="date" defaultValue="1990-01-01" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea className="pl-9 min-h-[80px]" defaultValue="123 Wellness Street, Vadodara, Gujarat" />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t bg-muted/5 px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                        Last updated: March 15, 2024
                    </div>
                    <div className="flex items-center gap-3">
                        {success && <span className="text-sm text-green-600 font-medium animate-pulse">Saved Successfully!</span>}
                        <Button onClick={handleSave} disabled={isLoading} className="bg-[#2d5016] hover:bg-[#2d5016]/90">
                            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
