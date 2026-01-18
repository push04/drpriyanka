"use client";

import { useState, useEffect } from "react";
import { FileText, Calendar, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";

export default function MedicalRecordsPage() {
    const { user } = useAuth();
    const [records, setRecords] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchRecords();
        }
    }, [user]);

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            // Using the API route which queries 'completed' appointments
            const response = await fetch('/api/patient/appointments', { headers });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch records');
            }

            const appointments = data.appointments || [];

            const formattedRecords = appointments
                .filter((apt: any) => apt.status === 'completed') // Double check status if API returns all
                .map((apt: any) => ({
                    id: apt.id,
                    date: new Date(apt.start_time).toLocaleDateString(),
                    type: "Consultation Report",
                    doctor: "Dr. Priyanka", // API might need to populate practitioner if not already
                    diagnosis: apt.service?.name || "Consultation",
                    notes: apt.notes || "No notes available for this session.",
                    rawDate: new Date(apt.start_time)
                }));

            setRecords(formattedRecords);

        } catch (error) {
            console.error("Error fetching records:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const generatePDF = (record: any) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(45, 80, 22); // #2d5016
        doc.text("Dr. Priyanka's Clinic", 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text("Holistic Wellness & Naturopathy", 20, 28);
        doc.line(20, 32, 190, 32);

        // Record Info
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text(`Medical Record: ${record.type}`, 20, 45);

        doc.setFontSize(10);
        doc.text(`DateVal: ${record.date}`, 20, 55);
        doc.text(`Patient: ${user?.email}`, 20, 60); // Using email as name might not be available directly in auth object without fetch
        doc.text(`Practitioner: ${record.doctor}`, 20, 65);

        // Content
        doc.setFillColor(240, 240, 240);
        doc.rect(20, 75, 170, 10, 'F');
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Diagnosis / Service", 25, 81);

        doc.setFont("helvetica", "normal");
        doc.text(record.diagnosis, 25, 95);

        doc.setFillColor(240, 240, 240);
        doc.rect(20, 105, 170, 10, 'F');
        doc.setFont("helvetica", "bold");
        doc.text("Clinical Notes", 25, 111);

        doc.setFont("helvetica", "normal");
        const splitNotes = doc.splitTextToSize(record.notes, 160);
        doc.text(splitNotes, 25, 125);

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("This is a digitally generated report.", 105, 280, { align: 'center' });

        doc.save(`${record.type.replace(/\s+/g, '_')}_${record.date}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-serif font-bold text-[#2d5016]">My Medical Records</h2>
                <p className="text-muted-foreground">Access your history, prescriptions, and reports securely.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin h-8 w-8 text-[#2d5016]" />
                </div>
            ) : (
                <div className="grid gap-6">
                    {records.map((record) => (
                        <Card key={record.id} className="border-l-4 border-l-[#2d5016]">
                            <CardHeader className="flex flex-row items-start justify-between pb-2">
                                <div>
                                    <Badge variant="outline" className="mb-2 border-[#2d5016]/20 text-[#2d5016] bg-[#2d5016]/5">
                                        {record.type}
                                    </Badge>
                                    <CardTitle className="text-xl">{record.diagnosis}</CardTitle>
                                    <CardDescription className="flex items-center mt-1">
                                        <Calendar className="w-3 h-3 mr-1" /> {record.date} • {record.doctor}
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2" onClick={() => generatePDF(record)}>
                                    <Download className="w-4 h-4" /> Download PDF
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {record.notes}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {!isLoading && records.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/10">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                    <h3 className="font-medium text-lg">No Records Found</h3>
                    <p className="text-muted-foreground">Medical history will appear here after your visits.</p>
                </div>
            )}
        </div>
    );
}
