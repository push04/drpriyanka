"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLastSaved(new Date());
        setIsSaving(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Settings</h2>
                    <p className="text-muted-foreground">Manage clinic preferences and account.</p>
                </div>
                <div className="flex items-center gap-4">
                    {lastSaved && <span className="text-sm text-green-600 fade-in">Saved!</span>}
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#2d5016] text-white hover:bg-[#2d5016]/90"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Clinic Profile</CardTitle>
                        <CardDescription>Update your clinic's public information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Clinic Name</label>
                                <Input defaultValue="Dr. Priyanka's Naturopathy Clinic" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact Phone</label>
                                <Input defaultValue="+91 98765 43210" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Contact Email</label>
                                <Input defaultValue="clinic@drpriyanka.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Website URL</label>
                                <Input defaultValue="https://drpriyanka.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <Input defaultValue="123 Wellness Ave, Alkapuri, Vadodara, Gujarat 390007" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Configure how you receive alerts.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-medium">Email Notifications</h4>
                                <p className="text-sm text-muted-foreground">Receive emails for new bookings.</p>
                            </div>
                            <input type="checkbox" className="toggle" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <h4 className="font-medium">SMS Alerts</h4>
                                <p className="text-sm text-muted-foreground">Receive SMS for urgent updates.</p>
                            </div>
                            <input type="checkbox" className="toggle" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
