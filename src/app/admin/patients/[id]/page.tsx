"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Calendar, Activity, Pill } from "lucide-react";

export default function PatientDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    // Mock Data based on ID (In real app, fetch from Supabase)
    const patient = {
        name: "Rahul Sharma",
        id: id,
        age: 34,
        bloodType: "O+",
        condition: "Chronic Back Pain",
        allergies: "None",
        history: [
            { date: "2024-03-15", type: "Visit", note: "Reported lower back pain reduction. Prescribed Yoga." },
            { date: "2024-03-01", type: "Consultation", note: "Initial diagnosis. Recommended MRI." },
        ],
        prescriptions: [
            { name: "Ashwagandha", dosage: "500mg daily", duration: "2 weeks" },
            { name: "Magnesium Oil", dosage: "Apply twice daily", duration: "1 month" }
        ]
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </Button>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-[#2d5016]">{patient.name}</h1>
                    <p className="text-muted-foreground">Patient ID: #00{id}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Vitals Card */}
                <Card className="md:col-span-1 border-t-4 border-t-[#2d5016]">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#2d5016]" /> Vitals & Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Age</span>
                            <span className="font-medium">{patient.age}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Blood Type</span>
                            <span className="font-medium">{patient.bloodType}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">Condition</span>
                            <span className="font-medium text-orange-600">{patient.condition}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Allergies</span>
                            <span className="font-medium">{patient.allergies}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Medical History */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" /> Medical Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6 relative border-l-2 border-muted ml-3 pl-6 py-2">
                            {patient.history.map((record, i) => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-600" />
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                                        <h4 className="font-bold text-gray-900">{record.type}</h4>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {record.date}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-sm">{record.note}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Prescriptions */}
                <Card className="md:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Pill className="w-5 h-5 text-purple-600" /> Current Medications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {patient.prescriptions.map((med, i) => (
                                <div key={i} className="p-4 bg-purple-50 rounded-lg border border-purple-100 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-purple-900">{med.name}</div>
                                        <div className="text-xs text-purple-700">{med.dosage}</div>
                                    </div>
                                    <div className="text-xs font-medium bg-white px-2 py-1 rounded border border-purple-200">
                                        {med.duration}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
