"use client";

import { useState, useEffect } from "react";
import { Bot, FileText, Download, Loader2, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import jsPDF from "jspdf";

export default function ReportsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [reportType, setReportType] = useState("Medical Report");
    const [notes, setNotes] = useState("");
    const [generatedContent, setGeneratedContent] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isLoadingPatients, setIsLoadingPatients] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await fetch('/api/admin/patients');
            const data = await response.json();
            if (response.ok && data.patients) {
                setPatients(data.patients);
            }
        } catch (error) {
            console.error("Error fetching patients:", error);
        }
        setIsLoadingPatients(false);
    };

    const handleGenerate = async () => {
        if (!selectedPatientId || !notes) {
            alert("Please select a patient and enter notes.");
            return;
        }

        setIsGenerating(true);
        try {
            const patient = patients.find(p => p.id === selectedPatientId);
            const response = await fetch('/api/admin/ai-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: selectedPatientId,
                    patientName: patient?.name || "Unknown",
                    type: reportType,
                    notes,
                    age: "Adult", // Placeholder, ideally fetch from profile
                    gender: "N/A"
                })
            });
            const data = await response.json();

            if (response.ok) {
                setGeneratedContent(data.content);
            } else {
                alert("Failed to generate report");
            }

        } catch (error) {
            console.error("Error generating report:", error);
            alert("Error generating report");
        }
        setIsGenerating(false);
    };

    const handleDownloadPDF = () => {
        if (!generatedContent) return;

        const doc = new jsPDF();
        const patient = patients.find(p => p.id === selectedPatientId);
        const date = new Date().toLocaleDateString();

        // 1. Decorative Header Background
        doc.setFillColor(45, 80, 22); // #2d5016 (Brand Color)
        doc.rect(0, 0, 210, 45, 'F');

        // 2. Header Text
        doc.setFontSize(26);
        doc.setTextColor(255, 255, 255);
        doc.setFont("times", "bold");
        doc.text("Dr. Priyanka's Clinic", 20, 25);

        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.text("Holistic Wellness & Naturopathy Center", 20, 35);

        // 3. Document Info Box using jsPDF commands (simplified box)
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(250, 250, 250);
        doc.rect(15, 55, 180, 35, 'FD'); // Fill and Draw

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Patient Name:`, 25, 65);
        doc.text(`Report Type:`, 25, 75);
        doc.text(`Date:`, 120, 65);

        doc.setFont("helvetica", "normal");
        doc.text(patient?.name || "N/A", 60, 65);
        doc.text(reportType, 60, 75);
        doc.text(date, 135, 65);

        // 4. Content Area
        doc.setFontSize(14);
        doc.setFont("times", "bold");
        doc.setTextColor(45, 80, 22);
        doc.text("REPORT DETAILS", 20, 105);
        doc.line(20, 108, 190, 108); // Separator Line

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        // Split text to fit page
        const splitText = doc.splitTextToSize(generatedContent, 170);

        // Check for page overflow logic (simplified for single page, can be improved)
        doc.text(splitText, 20, 118);

        // 5. Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setDrawColor(45, 80, 22);
        doc.line(20, pageHeight - 30, 190, pageHeight - 30);

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("Dr. Priyanka - Naturopath Specialist", 20, pageHeight - 20);
        doc.text("Contact: +91 98765 43210 | email@example.com", 20, pageHeight - 15);

        doc.setFontSize(8);
        doc.text("This document is electronically generated.", 140, pageHeight - 15);

        doc.save(`${reportType.replace(/\s+/g, '_')}_${patient?.name || 'Patient'}.pdf`);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-serif font-bold text-[#2d5016] flex items-center gap-2">
                    <Bot className="w-8 h-8" /> AI Report Generator
                </h2>
                <p className="text-muted-foreground">Generate professional medical reports, prescriptions, and referral letters instantly.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Input Details</CardTitle>
                        <CardDescription>Select patient and provide clinical notes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Patient</label>
                            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a patient..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoadingPatients ? (
                                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                                    ) : patients.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.email})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Report Type</label>
                            <Select value={reportType} onValueChange={setReportType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Medical Report">Medical Report</SelectItem>
                                    <SelectItem value="Prescription">Prescription</SelectItem>
                                    <SelectItem value="Referral Letter">Referral Letter</SelectItem>
                                    <SelectItem value="Discharge Summary">Discharge Summary</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Clinical Notes / Findings</label>
                            <Textarea
                                placeholder="Enter symptoms, diagnosis, medications, or key observations..."
                                className="min-h-[150px]"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <Button
                            className="w-full bg-[#2d5016] hover:bg-[#2d5016]/90 text-white"
                            onClick={handleGenerate}
                            disabled={isGenerating || !selectedPatientId || !notes}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                                </>
                            ) : (
                                <>
                                    <Bot className="mr-2 h-4 w-4" /> Generate Report
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Generated Output</CardTitle>
                        {generatedContent && (
                            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                                <Download className="mr-2 h-4 w-4" /> Download PDF
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1 min-h-[400px]">
                        {generatedContent ? (
                            <Textarea
                                className="w-full h-full min-h-[400px] font-mono text-sm bg-muted/20"
                                value={generatedContent}
                                onChange={(e) => setGeneratedContent(e.target.value)}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground border-2 border-dashed rounded-lg p-8">
                                <FileText className="w-12 h-12 mb-4 opacity-50" />
                                <p>Generated report will appear here.</p>
                                <p className="text-xs mt-2">You can edit the result before downloading.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
