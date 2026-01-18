"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, X, Clock, MoreVertical, Search, Filter, Loader2, Trash2, CheckCircle, FileText, Activity, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [patientHistory, setPatientHistory] = useState<any>(null);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/appointments');
            const data = await response.json();

            if (response.ok && data.appointments) {
                setAppointments(data.appointments);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
        setIsLoading(false);
    };

    const fetchPatientHistory = async (patientId: string) => {
        if (!patientId) {
            setPatientHistory(null);
            return;
        }
        setHistoryLoading(true);
        try {
            const response = await fetch(`/api/admin/patients/history?patientId=${patientId}`);
            const data = await response.json();
            if (response.ok && data.history) {
                // Parse the JSON string fields
                const history = {
                    ...data.history,
                    chief_complaint: data.history.chief_complaint ? JSON.parse(data.history.chief_complaint) : null,
                    current_medications: data.history.current_medications ? JSON.parse(data.history.current_medications) : null,
                    past_history: data.history.past_history ? JSON.parse(data.history.past_history) : null,
                    allergies: data.history.allergies ? JSON.parse(data.history.allergies) : null,
                };
                setPatientHistory(history);
            } else {
                setPatientHistory(null);
            }
        } catch (error) {
            console.error("Error fetching patient history:", error);
            setPatientHistory(null);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleViewDetails = (apt: any) => {
        setSelectedAppointment(apt);
        if (apt.patient_id) {
            fetchPatientHistory(apt.patient_id);
        } else {
            setPatientHistory(null);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        if (selectedAppointment?.id === id) {
            setSelectedAppointment((prev: any) => ({ ...prev, status: newStatus }));
        }

        try {
            const response = await fetch('/api/admin/appointments', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (!response.ok) {
                console.error("Failed to update status");
                alert("Failed to update status");
                fetchAppointments();
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status");
            fetchAppointments();
        }
    };

    const deleteAppointment = async (id: string) => {
        if (!confirm("Are you sure you want to delete this appointment? This action cannot be undone.")) return;

        setAppointments(prev => prev.filter(a => a.id !== id));
        if (selectedAppointment?.id === id) setSelectedAppointment(null);

        try {
            const response = await fetch(`/api/admin/appointments?id=${id}`, { method: 'DELETE' });
            if (!response.ok) {
                alert("Failed to delete appointment");
                fetchAppointments();
            }
        } catch (error) {
            console.error("Failed to delete appointment:", error);
            alert("Failed to delete appointment");
            fetchAppointments();
        }
    };

    const filteredAppointments = appointments.filter(apt =>
        apt.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 relative">
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
                                        <tr key={apt.id} className="hover:bg-muted/5 transition-colors cursor-pointer" onClick={() => handleViewDetails(apt)}>
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
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(apt)}>
                                                        View
                                                    </Button>
                                                    {/* Other actions can remain here or just rely on View modal actions */}
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

            {/* Detail Modal */}
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
                            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b flex justify-between items-center bg-[#2d5016]/5 sticky top-0 bg-white z-10">
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-[#2d5016]">Appointment Details</h3>
                                    <p className="text-sm text-muted-foreground">ID: #{selectedAppointment.id.slice(0, 8)}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedAppointment(null)}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Appointment Info */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="font-semibold flex items-center gap-2 text-[#2d5016]">
                                            <Clock className="w-4 h-4" /> Session Info
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between border-b pb-1">
                                                <span className="text-muted-foreground">Service</span>
                                                <span className="font-medium">{selectedAppointment.service}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-1">
                                                <span className="text-muted-foreground">Date</span>
                                                <span className="font-medium">{selectedAppointment.date}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-1">
                                                <span className="text-muted-foreground">Time</span>
                                                <span className="font-medium">{selectedAppointment.time}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-1">
                                                <span className="text-muted-foreground">Status</span>
                                                <span className="capitalize font-medium">{selectedAppointment.status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-semibold flex items-center gap-2 text-[#2d5016]">
                                            <FileText className="w-4 h-4" /> Patient Info
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between border-b pb-1">
                                                <span className="text-muted-foreground">Name</span>
                                                <span className="font-medium">{selectedAppointment.patient}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-1">
                                                <span className="text-muted-foreground">Phone</span>
                                                <span className="font-medium">{selectedAppointment.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                    {selectedAppointment.status === 'pending' && (
                                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(selectedAppointment.id, 'confirmed')}>
                                            <Check className="w-4 h-4 mr-1" /> Confirm Booking
                                        </Button>
                                    )}
                                    {selectedAppointment.status === 'confirmed' && (
                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => updateStatus(selectedAppointment.id, 'completed')}>
                                            <CheckCircle className="w-4 h-4 mr-1" /> Mark Completed
                                        </Button>
                                    )}
                                    {selectedAppointment.status !== 'cancelled' && (
                                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => updateStatus(selectedAppointment.id, 'cancelled')}>
                                            <X className="w-4 h-4 mr-1" /> Cancel
                                        </Button>
                                    )}
                                    <Button size="sm" variant="destructive" onClick={() => deleteAppointment(selectedAppointment.id)}>
                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                                    </Button>
                                </div>

                                {/* Patient History Section */}
                                <div className="border-t pt-6">
                                    <h4 className="font-semibold flex items-center gap-2 text-[#2d5016] mb-4">
                                        <Activity className="w-4 h-4" /> Medical History & Profile
                                    </h4>

                                    {historyLoading ? (
                                        <div className="text-center py-8"><Loader2 className="animate-spin h-6 w-6 mx-auto text-muted-foreground" /></div>
                                    ) : patientHistory ? (
                                        <div className="grid gap-4 bg-muted/20 p-4 rounded-lg text-sm">
                                            {patientHistory.chief_complaint?.complaint && (
                                                <div>
                                                    <span className="font-semibold block text-xs uppercase text-muted-foreground mb-1">Chief Complaint</span>
                                                    <p>{patientHistory.chief_complaint.complaint}</p>
                                                </div>
                                            )}
                                            {patientHistory.current_medications?.medications?.length > 0 && (
                                                <div>
                                                    <span className="font-semibold block text-xs uppercase text-muted-foreground mb-1">Current Medications</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {patientHistory.current_medications.medications.map((m: any, i: number) => (
                                                            <span key={i} className="bg-white px-2 py-1 rounded border shadow-sm">{m.name} ({m.dosage})</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {patientHistory.allergies?.drug?.length > 0 && (
                                                <div>
                                                    <span className="font-semibold block text-xs uppercase text-muted-foreground mb-1 text-red-600">Allergies</span>
                                                    <p className="text-red-700">{patientHistory.allergies.drug.map((a: any) => a.allergen).join(", ")}</p>
                                                </div>
                                            )}
                                            {!patientHistory.chief_complaint && !patientHistory.current_medications && (
                                                <p className="text-muted-foreground italic">Patient has a profile but no detailed entries visible.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-muted/10 rounded-lg border border-dashed">
                                            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                            <p className="text-muted-foreground">No health profile found for this patient.</p>
                                            <p className="text-xs text-muted-foreground mt-1">Patient hasn't filled out their medical history yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
