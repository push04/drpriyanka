"use client";

import { PatientHealthProfile } from "@/types/health";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface SectionProps {
    formData: Partial<PatientHealthProfile>;
    setFormData: (data: Partial<PatientHealthProfile>) => void;
}

export default function FamilyHistorySection({ formData, setFormData }: SectionProps) {
    const [newEntry, setNewEntry] = useState({ condition: "", relationship: "" });

    const addHistory = () => {
        if (!newEntry.condition || !newEntry.relationship) return;

        // key=condition, value=relationship
        // We might want to allow multiple relationships for one condition? 
        // For simplicity, let's just append relationship if it exists: "Mother, Father"
        const existing = formData.family_history?.[newEntry.condition];
        const val = existing ? `${existing}, ${newEntry.relationship}` : newEntry.relationship;

        setFormData({
            ...formData,
            family_history: {
                ...formData.family_history,
                [newEntry.condition]: val
            }
        });
        setNewEntry({ condition: "", relationship: "" });
    };

    const removeHistory = (condition: string) => {
        const updated = { ...formData.family_history };
        delete updated[condition];
        setFormData({ ...formData, family_history: updated });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Family Medical History</CardTitle>
                    <CardDescription>
                        Does anyone in your immediate family (Parents, Siblings, Grandparents) have these conditions?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Common Conditions Quick Check could be here, but let's do dynamic list for flexibility */}

                    <div className="space-y-4">
                        {Object.entries(formData.family_history || {}).map(([condition, relationship]) => (
                            <div key={condition} className="flex items-center justify-between p-3 bg-muted/40 rounded border">
                                <div>
                                    <span className="font-semibold block text-sm">{condition}</span>
                                    <span className="text-xs text-muted-foreground">Relation: {relationship}</span>
                                </div>
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => removeHistory(condition)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {Object.keys(formData.family_history || {}).length === 0 && (
                            <p className="text-sm text-muted-foreground italic">No family history recorded.</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
                        <div className="space-y-2">
                            <Label>Condition</Label>
                            <Input
                                placeholder="e.g. Diabetes, Cancer"
                                value={newEntry.condition}
                                onChange={(e) => setNewEntry({ ...newEntry, condition: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Relationship</Label>
                            <Input
                                placeholder="e.g. Mother, Paternal Grandfather"
                                value={newEntry.relationship}
                                onChange={(e) => setNewEntry({ ...newEntry, relationship: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Button type="button" onClick={addHistory} className="w-full bg-[#2d5016]/10 text-[#2d5016] hover:bg-[#2d5016]/20">
                                <Plus className="h-4 w-4 mr-2" /> Add Entry
                            </Button>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
