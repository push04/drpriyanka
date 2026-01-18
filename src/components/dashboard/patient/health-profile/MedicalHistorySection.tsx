"use client";

import { PatientHealthProfile, SurgeryRecord, MedicationRecord } from "@/types/health";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Table, ... } from "@/components/ui/table"; // Removing missing component
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

// Fallback if Table components missing, but creating simple structure
// I'll assume Table exists or use simple divs for safety if I didn't check.
// I'll use simple divs for the dynamic lists to be safe and fast.

interface SectionProps {
    formData: Partial<PatientHealthProfile>;
    setFormData: (data: Partial<PatientHealthProfile>) => void;
}

export default function MedicalHistorySection({ formData, setFormData }: SectionProps) {
    // Local state for new entries
    const [newSurgery, setNewSurgery] = useState<SurgeryRecord>({ procedure: "", year: "" });
    const [newMed, setNewMed] = useState<MedicationRecord>({ name: "", dosage: "", frequency: "" });
    const [newCondition, setNewCondition] = useState("");

    // --- Surgeries ---
    const addSurgery = () => {
        if (!newSurgery.procedure || !newSurgery.year) return;
        setFormData({
            ...formData,
            surgeries: [...(formData.surgeries || []), newSurgery]
        });
        setNewSurgery({ procedure: "", year: "" });
    };

    const removeSurgery = (index: number) => {
        const updated = [...(formData.surgeries || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, surgeries: updated });
    };

    // --- Medications ---
    const addMedication = () => {
        if (!newMed.name) return;
        setFormData({
            ...formData,
            current_medications: [...(formData.current_medications || []), newMed]
        });
        setNewMed({ name: "", dosage: "", frequency: "" });
    };

    const removeMedication = (index: number) => {
        const updated = [...(formData.current_medications || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, current_medications: updated });
    };

    // --- Chronic Conditions ---
    const addCondition = () => {
        if (!newCondition.trim()) return;
        setFormData({
            ...formData,
            chronic_conditions: [...(formData.chronic_conditions || []), newCondition.trim()]
        });
        setNewCondition("");
    };

    const removeCondition = (index: number) => {
        const updated = [...(formData.chronic_conditions || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, chronic_conditions: updated });
    };


    return (
        <div className="space-y-6">

            {/* Chronic Conditions */}
            <Card>
                <CardHeader>
                    <CardTitle>Chronic Conditions</CardTitle>
                    <CardDescription>Do you have any ongoing medical conditions? (e.g. Diabetes, Hypertension)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.chronic_conditions?.map((condition, i) => (
                            <div key={i} className="bg-red-50 text-red-900 border border-red-200 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                {condition}
                                <button onClick={() => removeCondition(i)} className="hover:text-red-700">
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 max-w-md">
                        <Input
                            placeholder="Add condition..."
                            value={newCondition}
                            onChange={(e) => setNewCondition(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                        />
                        <Button type="button" onClick={addCondition} variant="secondary" size="icon">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Current Medications */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Medications & Supplements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* List */}
                    <div className="space-y-2">
                        {formData.current_medications?.map((med, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded border text-sm">
                                <span className="font-medium flex-1">{med.name}</span>
                                <span className="text-muted-foreground w-20">{med.dosage}</span>
                                <span className="text-muted-foreground w-24">{med.frequency}</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => removeMedication(i)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                        {(!formData.current_medications || formData.current_medications.length === 0) && (
                            <p className="text-sm text-muted-foreground italic">No medications listed.</p>
                        )}
                    </div>

                    {/* Add New */}
                    <div className="grid grid-cols-12 gap-2 items-end border-t pt-4">
                        <div className="col-span-5 space-y-1">
                            <Label className="text-xs">Medication Name</Label>
                            <Input
                                placeholder="name"
                                value={newMed.name}
                                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                            />
                        </div>
                        <div className="col-span-3 space-y-1">
                            <Label className="text-xs">Dosage</Label>
                            <Input
                                placeholder="mg/ml"
                                value={newMed.dosage}
                                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                            />
                        </div>
                        <div className="col-span-3 space-y-1">
                            <Label className="text-xs">Frequency</Label>
                            <Input
                                placeholder="daily/weekly"
                                value={newMed.frequency}
                                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                            />
                        </div>
                        <div className="col-span-1">
                            <Button type="button" onClick={addMedication} size="icon" className="bg-[#2d5016]">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Surgeries */}
            <Card>
                <CardHeader>
                    <CardTitle>Surgical History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* List */}
                    <div className="space-y-2">
                        {formData.surgeries?.map((surg, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded border text-sm">
                                <span className="font-medium flex-1">{surg.procedure}</span>
                                <span className="text-muted-foreground">{surg.year}</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => removeSurgery(i)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Add New */}
                    <div className="grid grid-cols-12 gap-2 items-end border-t pt-4">
                        <div className="col-span-8 space-y-1">
                            <Label className="text-xs">Procedure</Label>
                            <Input
                                placeholder="Appendix removal, etc."
                                value={newSurgery.procedure}
                                onChange={(e) => setNewSurgery({ ...newSurgery, procedure: e.target.value })}
                            />
                        </div>
                        <div className="col-span-3 space-y-1">
                            <Label className="text-xs">Year</Label>
                            <Input
                                placeholder="YYYY"
                                value={newSurgery.year}
                                onChange={(e) => setNewSurgery({ ...newSurgery, year: e.target.value })}
                            />
                        </div>
                        <div className="col-span-1">
                            <Button type="button" onClick={addSurgery} size="icon" className="bg-[#2d5016]">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
