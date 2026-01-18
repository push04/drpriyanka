"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, FileText, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ConsultationNotesProps {
    patientId: string;
    practitionerId?: string; // Optional for now, can be inferred from auth
}

export function ConsultationNotes({ patientId, practitionerId }: ConsultationNotesProps) {
    const [loading, setLoading] = useState(false);
    const [soap, setSoap] = useState({
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
        private_notes: ""
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            // Get current user if practitionerId not provided
            let finalPractitionerId = practitionerId;
            if (!finalPractitionerId) {
                const { data: { user } } = await supabase.auth.getUser();
                finalPractitionerId = user?.id; // Assuming user is practitioner
            }

            const { error } = await supabase
                .from('consultation_notes')
                .insert({
                    patient_id: patientId,
                    practitioner_id: finalPractitionerId,
                    visit_date: new Date().toISOString().split('T')[0],
                    subjective: soap.subjective,
                    objective: soap.objective,
                    assessment: soap.assessment,
                    plan: soap.plan,
                    private_notes: soap.private_notes
                });

            if (error) throw error;
            alert("Consultation note saved successfully.");
            setSoap({ subjective: "", objective: "", assessment: "", plan: "", private_notes: "" }); // Reset
            // Ideally trigger refresh or callback here

        } catch (error: any) {
            console.error("Error saving notes:", error);
            alert("Failed to save note: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#2d5016]" /> Consultation Notes (SOAP)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="soap" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="soap">SOAP Entry</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="soap" className="space-y-4 pt-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="subjective" className="text-blue-700 font-bold">Subjective (S)</Label>
                                <Textarea
                                    id="subjective"
                                    placeholder="Patient's stated symptoms, history of present illness..."
                                    value={soap.subjective}
                                    onChange={(e) => setSoap({ ...soap, subjective: e.target.value })}
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="objective" className="text-green-700 font-bold">Objective (O)</Label>
                                <Textarea
                                    id="objective"
                                    placeholder="Vital signs, physical exam findings, lab results..."
                                    value={soap.objective}
                                    onChange={(e) => setSoap({ ...soap, objective: e.target.value })}
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="assessment" className="text-orange-700 font-bold">Assessment (A)</Label>
                                <Textarea
                                    id="assessment"
                                    placeholder="Diagnosis, differential diagnosis, progress status..."
                                    value={soap.assessment}
                                    onChange={(e) => setSoap({ ...soap, assessment: e.target.value })}
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="plan" className="text-purple-700 font-bold">Plan (P)</Label>
                                <Textarea
                                    id="plan"
                                    placeholder="Treatment plan, prescriptions, referrals, follow-up..."
                                    value={soap.plan}
                                    onChange={(e) => setSoap({ ...soap, plan: e.target.value })}
                                    className="min-h-[80px]"
                                />
                            </div>
                        </div>

                        <Button onClick={handleSave} disabled={loading} className="w-full bg-[#2d5016] hover:bg-[#2d5016]/90 mt-4">
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Consultation Note
                        </Button>
                    </TabsContent>

                    <TabsContent value="history">
                        <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                            Feature coming in next update: Historical notes view.
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
