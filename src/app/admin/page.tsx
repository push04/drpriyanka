"use client";

import { motion } from "framer-motion";
import { Users, Calendar, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stats = [
    { label: "Today's Appointments", value: "12", icon: Calendar, change: "+2 from yesterday" },
    { label: "Total Patients", value: "1,204", icon: Users, change: "+4 new this week" },
    { label: "Revenue (Today)", value: "₹15,400", icon: DollarSign, change: "+12% vs last week" },
    { label: "Pending Requests", value: "3", icon: Activity, change: "Requires attention" },
];

const recentAppointments = [
    { id: 1, patient: "Rahul Sharma", service: "Therapeutic Yoga", time: "10:00 AM", status: "Confirmed" },
    { id: 2, patient: "Anjali Gupta", service: "Hydrotherapy", time: "11:30 AM", status: "Checked In" },
    { id: 3, patient: "Vikram Singh", service: "Massage", time: "02:00 PM", status: "Pending" },
    { id: 4, patient: "Sneha Patel", service: "Consultation", time: "04:00 PM", status: "Confirmed" },
];

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.label}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {stat.change}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="text-xl">Today's Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentAppointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/10">
                                    <div className="flex items-center gap-4">
                                        <div className="font-bold text-lg w-20">{apt.time}</div>
                                        <div>
                                            <div className="font-medium">{apt.patient}</div>
                                            <div className="text-sm text-muted-foreground">{apt.service}</div>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium 
                    ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-blue-100 text-blue-700'}`}>
                                        {apt.status}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-xl">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Button className="w-full bg-primary text-primary-foreground p-3 rounded-md hover:bg-primary/90 transition-colors h-auto justify-start" asChild>
                            <Link href="/admin/appointments">+ New Appointment</Link>
                        </Button>
                        <Button className="w-full border border-input p-3 rounded-md hover:bg-accent transition-colors h-auto justify-start" variant="outline" asChild>
                            <Link href="/admin/patients">View Patient Registry</Link>
                        </Button>
                        <Button className="w-full border border-input p-3 rounded-md hover:bg-accent transition-colors h-auto justify-start" variant="outline" asChild>
                            <Link href="/admin/settings">Manage Settings</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
