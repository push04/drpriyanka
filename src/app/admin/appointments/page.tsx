"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, X, Clock, MoreVertical, Search, Filter, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setIsLoading(true);
        // Fetch appointments with service name (basic join strategy for MVP)
        const { data: apts, error } = await supabase
            .from('appointments')
            .select('*')
            .order('start_time', { ascending: false });

        if (apts) {
            // Fetch service names
            const serviceIds = apts.map(a => a.service_id);
            const { data: services } = await supabase.from('services').select('id, name').in('id', serviceIds);

            const formatted = apts.map(apt => {
                const service = services?.find(s => s.id === apt.service_id);
                const dateObj = new Date(apt.start_time);
                return {
                    id: apt.id,
                    patient: apt.patient_name || "Guest Patient",
                    service: service?.name || "Service",
                    date: dateObj.toLocaleDateString(),
                    time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: apt.status,
                    phone: apt.patient_phone || "N/A"
                };
            });
            setAppointments(formatted);
        }
        setIsLoading(false);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        // Optimistic update
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));

        const { error } = await supabase
            .from('appointments')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            console.error("Failed to update status");
            alert("Failed to update status");
            fetchAppointments(); // Revert on error
        }
    };

    const filteredAppointments = appointments.filter(apt =>
        apt.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Appointments</h2>
                    <p className="text-muted-foreground">Manage your clinic's schedule.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button asChild className="bg-[#2d5016] text-white hover:bg-[#2d5016]/90">
                        <Link href="/admin/appointments/new">
                            + New Booking
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <CardTitle className="text-lg font-medium">All Bookings</CardTitle>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search patient or service..."
                                className="pl-9 w-[250px] bg-muted/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-md border-t-0">
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/10 text-muted-foreground font-medium border-b">
                                    <tr>
                                        <th className="px-6 py-4">Patient</th>
                                        <th className="px-6 py-4">Service</th>
                                        <th className="px-6 py-4">Date & Time</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredAppointments.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-8 text-muted-foreground">No appointments found.</td>
                                        </tr>
                                    ) : filteredAppointments.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-muted/5 transition-colors">
                                            <td className="px-6 py-4 font-medium">
                                                <div>{apt.patient}</div>
                                                <div className="text-xs text-muted-foreground">{apt.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">{apt.service}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                                    <span>{apt.date}, {apt.time}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize
                                                ${apt.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        apt.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                            apt.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {apt.status === 'pending' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            onClick={() => updateStatus(apt.id, 'confirmed')}
                                                            title="Confirm"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                    {apt.status !== 'cancelled' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => updateStatus(apt.id, 'cancelled')}
                                                            title="Cancel"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
