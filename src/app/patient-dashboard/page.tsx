"use client";

import { motion } from "framer-motion";
import { Calendar, Activity, Clock, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PatientDashboard() {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-[#2d5016] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-serif font-bold mb-2">Hello, Jane!</h2>
                    <p className="opacity-90 max-w-xl">
                        "Healing is a matter of time, but it is sometimes also a matter of opportunity."
                    </p>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 translate-x-12" />
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Session</CardTitle>
                        <Calendar className="h-4 w-4 text-[#2d5016]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold">Today, 4:00 PM</div>
                        <p className="text-xs text-muted-foreground mt-1">Therapeutic Yoga with Dr. Priyanka</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Wellness Streaks</CardTitle>
                        <Activity className="h-4 w-4 text-[#e07a5f]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12 Days</div>
                        <p className="text-xs text-muted-foreground mt-1">Consistent attendance!</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Next Goal</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Hydration</div>
                        <p className="text-xs text-muted-foreground mt-1">Track 8 glasses today</p>
                    </CardContent>
                </Card>
            </div>

            {/* Sections Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Your Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 border rounded-lg border-l-4 border-l-[#2d5016] bg-[#f9f9f9]">
                                <div className="text-center min-w-[60px]">
                                    <div className="text-xs font-bold text-muted-foreground uppercase">Today</div>
                                    <div className="text-xl font-bold">17</div>
                                </div>
                                <div>
                                    <div className="font-bold">Therapeutic Yoga</div>
                                    <div className="text-sm text-muted-foreground">4:00 PM • 60 min</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-white opacity-60">
                                <div className="text-center min-w-[60px]">
                                    <div className="text-xs font-bold text-muted-foreground uppercase">Jan</div>
                                    <div className="text-xl font-bold">24</div>
                                </div>
                                <div>
                                    <div className="font-bold">Mud Therapy</div>
                                    <div className="text-sm text-muted-foreground">10:00 AM • 45 min</div>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/patient-dashboard/appointments">View All Appointments</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Recent Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 border-b">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-blue-100 fill-blue-600" />
                                    <div>
                                        <div className="font-medium">Diet Plan - Jan 2026</div>
                                        <div className="text-xs text-muted-foreground">Added yesterday</div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">Download</Button>
                            </div>
                            <div className="flex items-center justify-between p-3 border-b">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-8 h-8 text-orange-100 fill-orange-600" />
                                    <div>
                                        <div className="font-medium">Prescription #4092</div>
                                        <div className="text-xs text-muted-foreground">Jan 10, 2026</div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">Download</Button>
                            </div>
                            <Button variant="outline" className="w-full">View All Records</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
