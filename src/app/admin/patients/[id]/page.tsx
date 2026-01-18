"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Calendar, Activity, Pill, Loader2 } from "lucide-react";
import { ConsultationNotes } from "@/components/dashboard/admin/ConsultationNotes";

export default function PatientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [patient, setPatient] = useState<any>(null);
    const [healthRecord, setHealthRecord] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);

            try {
                const response = await fetch(`/api/admin/patients/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setPatient(data.patient);
                    setHealthRecord(data.healthRecord);
                    setAppointments(data.appointments || []);
                }
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }

            setLoading(false);
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#2d5016]" />
            </div>
        );
    }

    if (!patient) {
        return <div className="p-8">Patient not found</div>;
    }

    // Helper to properly display array/json fields
    const allergies = healthRecord?.allergies;
    const medicationList = healthRecord?.current_medications || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#2d5016]">{patient.full_name}</h1>
                    <p className="text-muted-foreground">{patient.email} • {patient.phone}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Vitals & Bio Card */}
                <Card className="md:col-span-1 border-t-4 border-t-[#2d5016]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#2d5016]" /> Health Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Chief Complaint</span>
                            <span className="font-medium text-right">{healthRecord?.chief_complaint || "N/A"}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Condition Duration</span>
                            <span className="font-medium">{healthRecord?.condition_duration || "N/A"}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Pain Level</span>
                            <span className="font-medium text-orange-600">{healthRecord?.pain_level ? `${healthRecord.pain_level}/10` : "N/A"}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-muted-foreground text-sm">Allergies</span>
                            <div className="flex flex-wrap gap-1">
                                {allergies?.drug?.length > 0 ? (
                                    allergies.drug.map((a: string, i: number) => <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">{a}</span>)
                                ) : <span className="text-sm">None Reported</span>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Content Column: Appointments & SOAP Notes */}
                <div className="md:col-span-2 space-y-6">
                    {/* SOAP Notes Section */}
                    <ConsultationNotes patientId={id} />

                    {/* Appointment History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" /> Appointment History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {appointments.length === 0 ? (
                                <p className="text-muted-foreground">No appointment history.</p>
                            ) : (
                                <div className="space-y-6 relative border-l-2 border-muted ml-3 pl-6 py-2">
                                    {appointments.map((appt) => (
                                        <div key={appt.id} className="relative">
                                            <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 ${appt.status === 'confirmed' ? 'bg-green-100 border-green-600' : 'bg-gray-100 border-gray-400'}`} />
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                                                <h4 className="font-bold text-gray-900">{appt.services?.name || "Consultation"}</h4>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    {new Date(appt.start_time).toLocaleDateString()} at {new Date(appt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground text-sm">Status: <span className="capitalize">{appt.status}</span></p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Medications */}
                {medicationList && medicationList.length > 0 && (
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Pill className="w-5 h-5 text-purple-600" /> Current Medications (Self-Reported)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {medicationList.map((med: any, i: number) => (
                                    <div key={i} className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-purple-900">{med.name}</div>
                                            <div className="text-xs text-purple-700">{med.dosage} - {med.frequency}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
