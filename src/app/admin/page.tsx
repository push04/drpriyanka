"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, DollarSign, Activity, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState([
        { label: "Today's Appointments", value: "-", icon: Calendar, change: "Loading..." },
        { label: "Total Patients", value: "-", icon: Users, change: "Loading..." },
        { label: "Revenue (Est.)", value: "₹0", icon: DollarSign, change: "Calculated from confirmed" },
        { label: "Pending Requests", value: "-", icon: Activity, change: "Requires attention" },
    ]);
    const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // 1. Get Today's Appointments Count
            const today = new Date().toISOString().split('T')[0];
            const { count: todayCount, error: todayError } = await supabase
                .from('appointments')
                .select('*', { count: 'exact', head: true })
                .gte('start_time', `${today}T00:00:00`)
                .lte('start_time', `${today}T23:59:59`);

            // 2. Get Total Patients Count
            const { count: patientCount, error: patientError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'patient');

            // 3. Get Pending Requests Count
            const { count: pendingCount, error: pendingError } = await supabase
                .from('appointments')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            // 4. Get Recent Appointments (with Service Name if possible, else raw)
            // Note: In a real production app, use a join. For MVP, we'll fetch raw.
            const { data: recentData, error: recentError } = await supabase
                .from('appointments')
                .select('id, start_time, status, patient_name, notes, service_id') // Added patient_name (guest) support
                .order('created_at', { ascending: false })
                .limit(5);

            // Fetch service names for recent appointments
            let formattedRecent = [];
            if (recentData) {
                // Fetch service details for these appointments
                const serviceIds = recentData.map(a => a.service_id);
                const { data: services } = await supabase.from('services').select('id, name').in('id', serviceIds);

                formattedRecent = recentData.map(apt => {
                    const service = services?.find(s => s.id === apt.service_id);
                    const dateObj = new Date(apt.start_time);
                    return {
                        id: apt.id,
                        patient: apt.patient_name || "Registered Patient", // Fallback for now
                        service: service?.name || "Service",
                        time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        status: apt.status
                    };
                });
            }

            setStats([
                { label: "Today's Appointments", value: todayCount?.toString() || "0", icon: Calendar, change: "Today" },
                { label: "Total Patients", value: patientCount?.toString() || "0", icon: Users, change: "All time" },
                { label: "Revenue (Est.)", value: "₹--", icon: DollarSign, change: "Not connected" }, // Revenue logic omitted for MVP simplicity
                { label: "Pending Requests", value: pendingCount?.toString() || "0", icon: Activity, change: "Action needed" },
            ]);
            setRecentAppointments(formattedRecent);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
                                    <div className="text-2xl font-bold">
                                        {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stat.value}
                                    </div>
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
                        <CardTitle className="text-xl">Recent Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                            ) : recentAppointments.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">No recent appointments.</div>
                            ) : (
                                recentAppointments.map((apt) => (
                                    <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg bg-muted/10">
                                        <div className="flex items-center gap-4">
                                            <div className="font-bold text-lg w-20">{apt.time}</div>
                                            <div>
                                                <div className="font-medium">{apt.patient}</div>
                                                <div className="text-sm text-muted-foreground">{apt.service}</div>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                    ${apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'}`}>
                                            {apt.status}
                                        </div>
                                    </div>
                                ))
                            )}
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
