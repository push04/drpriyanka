"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Activity, Clock, FileText, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export default function PatientDashboard() {
    const { user, isLoading: authLoading } = useAuth();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!user) return;

            try {
                // Fetch upcoming appointments
                const { data: apts, error: aptError } = await supabase
                    .from('appointments')
                    .select('*, services(name, duration)')
                    .eq('patient_id', user.id)
                    .gte('appointment_date', new Date().toISOString().split('T')[0])
                    .order('appointment_date', { ascending: true })
                    .limit(2);

                if (aptError) console.error("Error fetching appointments:", aptError);
                else setAppointments(apts || []);

                // Fetch latest vitals
                const { data: vital, error: vitalError } = await supabase
                    .from('health_metrics')
                    .select('*')
                    .eq('patient_id', user.id)
                    .eq('category', 'Vitals')
                    .order('recorded_at', { ascending: false })
                    .limit(1)
                    .single();

                if (vitalError && vitalError.code !== 'PGRST116') console.error("Error fetching vitals:", vitalError);
                else setMetrics(vital);

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading) {
            fetchData();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    const nextAppointment = appointments[0];
    const userName = user?.user_metadata?.full_name || "Patient";

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-[#2d5016] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-serif font-bold mb-2">Hello, {userName}!</h2>
                    <p className="opacity-90 max-w-xl">
                        "Healing is a matter of time, but it is sometimes also a matter of opportunity."
                    </p>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 translate-x-12" />
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Session</CardTitle>
                        <Calendar className="h-4 w-4 text-[#2d5016]" />
                    </CardHeader>
                    <CardContent>
                        {nextAppointment ? (
                            <>
                                <div className="text-xl font-bold">
                                    {format(new Date(nextAppointment.appointment_date + 'T' + nextAppointment.appointment_time), 'MMM d, h:mm a')}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {nextAppointment.services?.name || "Consultation"}
                                </p>
                            </>
                        ) : (
                            <div className="text-sm text-muted-foreground py-2">No upcoming sessions</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Wellness Streaks</CardTitle>
                        <Activity className="h-4 w-4 text-[#e07a5f]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0 Days</div>
                        <p className="text-xs text-muted-foreground mt-1">Start a habit today!</p>
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Recent Vitals</CardTitle>
                        <Activity className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        {metrics ? (
                            <div className="text-2xl font-bold">BP: {metrics.data?.bp_systolic}/{metrics.data?.bp_diastolic}</div>
                        ) : (
                            <div className="text-sm text-muted-foreground py-1">No recent vitals</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            <Link href="/patient-dashboard/metrics" className="hover:underline text-primary">Log new reading &rarr;</Link>
                        </p>
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
                            {appointments.length > 0 ? (
                                appointments.map((apt) => (
                                    <div key={apt.id} className="flex items-center gap-4 p-4 border rounded-lg border-l-4 border-l-[#2d5016] bg-[#f9f9f9]">
                                        <div className="text-center min-w-[60px]">
                                            <div className="text-xs font-bold text-muted-foreground uppercase">
                                                {format(new Date(apt.appointment_date), 'MMM')}
                                            </div>
                                            <div className="text-xl font-bold">
                                                {format(new Date(apt.appointment_date), 'd')}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{apt.services?.name || "Consultation"}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {format(new Date(`2000-01-01T${apt.appointment_time}`), 'h:mm a')} • {apt.services?.duration || "30 min"}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>No upcoming appointments.</p>
                                    <Button variant="link" asChild className="mt-2">
                                        <Link href="/book">Book Now</Link>
                                    </Button>
                                </div>
                            )}

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
                            {/* Placeholder for now as documents table is usually empty in fresh setup */}
                            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                <FileText className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                <p>No documents uploaded yet.</p>
                            </div>
                            <Button variant="outline" className="w-full">View All Records</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
