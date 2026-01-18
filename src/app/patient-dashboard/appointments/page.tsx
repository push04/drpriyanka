"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";

interface Appointment {
    id: string;
    service_id: string;
    patient_id: string;
    patient_name: string;
    start_time: string;
    end_time: string;
    status: string;
    notes?: string;
    service_name?: string;
    duration?: string;
}

export default function PatientAppointments() {
    const { user, isLoading: authLoading } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    useEffect(() => {
        async function fetchAppointments() {
            if (!user) return;

            try {
                // Fetch appointments using server-side API that bypasses RLS
                const response = await fetch('/api/patient/appointments');
                const data = await response.json();

                if (response.ok && data.appointments) {
                    setAppointments(data.appointments);
                } else {
                    console.error("Error fetching appointments:", data.error);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        }

        if (!authLoading && user) {
            fetchAppointments();
        } else if (!authLoading && !user) {
            setLoading(false);
        }
    }, [user, authLoading]);

    const handleCancelAppointment = async (id: string) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;

        try {
            const response = await fetch('/api/patient/appointments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'cancelled' })
            });

            if (response.ok) {
                // Update local state
                setAppointments(prev =>
                    prev.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt)
                );
                if (selectedAppointment?.id === id) {
                    setSelectedAppointment(prev => prev ? { ...prev, status: 'cancelled' } : null);
                }
            } else {
                alert("Failed to cancel appointment");
            }
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            alert("Failed to cancel appointment");
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'completed':
                return 'bg-blue-100 text-blue-700';
            case 'cancelled':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-blue-100 text-blue-700';
        }
    };

    const formatAppointmentDate = (startTime: string) => {
        const date = new Date(startTime);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return `Today, ${format(date, 'MMM d')}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `Tomorrow, ${format(date, 'MMM d')}`;
        }
        return format(date, 'MMM d, yyyy');
    };

    const formatAppointmentTime = (startTime: string) => {
        return format(new Date(startTime), 'h:mm a');
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Please log in to view your appointments.</p>
                <Button asChild>
                    <Link href="/login">Log In</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">My Appointments</h2>
                    <p className="text-muted-foreground">Manage your upcoming and past sessions.</p>
                </div>
                <Button className="bg-[#2d5016]" asChild>
                    <Link href="/book">Book New Appointment</Link>
                </Button>
            </div>

            <div className="space-y-4">
                {appointments.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground mb-4">No appointments found.</p>
                            <Button asChild>
                                <Link href="/book">Book Your First Appointment</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    appointments.map((apt) => (
                        <Card key={apt.id} className="overflow-hidden transition-all hover:shadow-md">
                            <div className="flex flex-col md:flex-row">
                                <div className={`w-full md:w-2 bg-[#2d5016] ${apt.status === 'completed' || apt.status === 'cancelled' ? 'opacity-30' : ''}`} />
                                <div className="p-6 flex-1 grid md:grid-cols-3 gap-4 items-center">
                                    <div className="cursor-pointer" onClick={() => setSelectedAppointment(apt)}>
                                        <div className="font-bold text-lg hover:underline decoration-dotted underline-offset-4">{apt.service_name || "Consultation"}</div>
                                        <div className="text-muted-foreground text-sm">with Dr. Priyanka</div>
                                        <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(apt.status)}`}>
                                            {apt.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm cursor-pointer" onClick={() => setSelectedAppointment(apt)}>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatAppointmentDate(apt.start_time)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatAppointmentTime(apt.start_time)} ({apt.duration || "60 min"})</span>
                                        </div>
                                    </div>

                                    <div className="flex md:justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedAppointment(apt)}>
                                            View Details
                                        </Button>

                                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                                            <>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/book?reschedule=${apt.id}`}>Reschedule</Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
                                                    onClick={() => handleCancelAppointment(apt.id)}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        )}
                                        {apt.status === 'cancelled' && (
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href="/book">Book Again</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Appointment Details Modal */}
            <AnimatePresence>
                {selectedAppointment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                        onClick={() => setSelectedAppointment(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="p-6 border-b flex justify-between items-center bg-[#2d5016]/5">
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-[#2d5016]">Appointment Details</h3>
                                    <p className="text-sm text-muted-foreground">ID: #{selectedAppointment.id.slice(0, 8)}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedAppointment(null)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">Service</label>
                                        <div className="font-medium text-lg">{selectedAppointment.service_name}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">Status</label>
                                        <div>
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusStyle(selectedAppointment.status)}`}>
                                                {selectedAppointment.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">Date</label>
                                        <div className="font-medium flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            {formatAppointmentDate(selectedAppointment.start_time)}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">Time</label>
                                        <div className="font-medium flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                            {formatAppointmentTime(selectedAppointment.start_time)} ({selectedAppointment.duration})
                                        </div>
                                    </div>
                                </div>

                                {selectedAppointment.notes && (
                                    <div className="bg-muted/30 p-4 rounded-lg">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Notes</label>
                                        <p className="text-sm">{selectedAppointment.notes}</p>
                                    </div>
                                )}

                                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm">
                                    <p className="font-semibold mb-1">Preparation Instructions:</p>
                                    <p>Please arrive 10 minutes before your scheduled time. Wear comfortable clothing for therapy sessions.</p>
                                </div>
                            </div>

                            <div className="p-6 border-t flex justify-end gap-2 bg-gray-50">
                                {selectedAppointment.status === 'confirmed' && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            if (confirm("Cancel this appointment?")) {
                                                handleCancelAppointment(selectedAppointment.id);
                                                setSelectedAppointment(null);
                                            }
                                        }}
                                    >
                                        Cancel Appointment
                                    </Button>
                                )}
                                <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
