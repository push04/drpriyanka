"use client";

import { PatientHealthProfile } from "@/types/health";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface SectionProps {
    formData: Partial<PatientHealthProfile>;
    setFormData: (data: Partial<PatientHealthProfile>) => void;
}

export default function WomensHealthSection({ formData, setFormData }: SectionProps) {
    const updateMenstrual = (field: string, value: any) => {
        setFormData({
            ...formData,
            menstrual_history: { ...formData.menstrual_history!, [field]: value }
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Women's Health</CardTitle>
                    <CardDescription>Optional section for female patients.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Menstrual Cycle Regularity</Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.menstrual_history?.cycle_regularity || "na"}
                            onChange={(e) => updateMenstrual('cycle_regularity', e.target.value)}
                        >
                            <option value="na">Not Applicable / Prefer not to say</option>
                            <option value="regular">Regular</option>
                            <option value="irregular">Irregular</option>
                            <option value="menopause">Menopause</option>
                        </select>
                    </div>

                    {(formData.menstrual_history?.cycle_regularity !== 'na') && (
                        <>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Cycle Length (Days)</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 28"
                                        value={formData.menstrual_history?.cycle_length_days || ""}
                                        onChange={(e) => updateMenstrual('cycle_length_days', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Period Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.menstrual_history?.last_period_date || ""}
                                        onChange={(e) => updateMenstrual('last_period_date', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Flow Quality & Issues</Label>
                                <Textarea
                                    placeholder="Describe any issues like heavy flow, pain (PMS), PCOS history..."
                                    value={formData.menstrual_history?.flow_quality || ""} // Mapping flow_quality to general text for now as existing schema has issues array but text is easier for user
                                    onChange={(e) => updateMenstrual('flow_quality', e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
