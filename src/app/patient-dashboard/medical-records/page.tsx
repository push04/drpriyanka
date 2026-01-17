"use client";

import { FileText, Calendar, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MedicalRecordsPage() {
    // Mock records - replace with DB fetch using auth.uid()
    const records = [
        {
            id: 1,
            date: "2024-03-15",
            type: "Consultation Report",
            doctor: "Dr. Priyanka",
            diagnosis: "Chronic Lower Back Pain",
            notes: "Patient shows improvement after 3 yoga sessions. Recommended continuing Mud Therapy.",
            files: ["report_mar15.pdf"]
        },
        {
            id: 2,
            date: "2024-02-28",
            type: "Lab Results",
            doctor: "Lab Technician",
            diagnosis: "Vitamin D Deficiency",
            notes: "Levels are low (18 ng/mL). Prescribed supplements and sun exposure.",
            files: ["lab_results_feb28.pdf"]
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-serif font-bold text-[#2d5016]">My Medical Records</h2>
                <p className="text-muted-foreground">Access your history, prescriptions, and reports securely.</p>
            </div>

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
                            <Button variant="outline" size="sm" className="gap-2">
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

            {records.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/10">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                    <h3 className="font-medium text-lg">No Records Found</h3>
                    <p className="text-muted-foreground">Medical history will appear here after your visits.</p>
                </div>
            )}
        </div>
    );
}
