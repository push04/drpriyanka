"use client";

import { PatientHealthProfile } from "@/types/health";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Slider } from "@/components/ui/slider"; // Shadcn slider needed
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface SectionProps {
    formData: Partial<PatientHealthProfile>;
    setFormData: (data: Partial<PatientHealthProfile>) => void;
}

export default function ChiefComplaintSection({ formData, setFormData }: SectionProps) {
    const [newGoal, setNewGoal] = useState("");
    const [newConcern, setNewConcern] = useState("");

    const addGoal = () => {
        if (!newGoal.trim()) return;
        setFormData({
            ...formData,
            health_goals: [...(formData.health_goals || []), newGoal.trim()]
        });
        setNewGoal("");
    };

    const removeGoal = (index: number) => {
        const updated = [...(formData.health_goals || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, health_goals: updated });
    };

    const addConcern = () => {
        if (!newConcern.trim()) return;
        setFormData({
            ...formData,
            primary_concerns: [...(formData.primary_concerns || []), newConcern.trim()]
        });
        setNewConcern("");
    }

    const removeConcern = (index: number) => {
        const updated = [...(formData.primary_concerns || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, primary_concerns: updated });
    };


    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Current Health Status</CardTitle>
                    <CardDescription>Tell us about your primary reason for visiting.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Chief Complaint */}
                    <div className="space-y-2">
                        <Label htmlFor="chief_complaint">Chief Complaint / Main Issue</Label>
                        <Textarea
                            id="chief_complaint"
                            placeholder="Describe your main health concern in detail..."
                            className="min-h-[100px]"
                            value={formData.chief_complaint || ""}
                            onChange={(e) => setFormData({ ...formData, chief_complaint: e.target.value })}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Duration */}
                        <div className="space-y-2">
                            <Label htmlFor="duration">How long have you had this condition?</Label>
                            <Input
                                id="duration"
                                placeholder="e.g. 2 weeks, 6 months..."
                                value={formData.condition_duration || ""}
                                onChange={(e) => setFormData({ ...formData, condition_duration: e.target.value })}
                            />
                        </div>

                        {/* Pain Level - Using simple select/input for now if slider causes issues without install */}
                        <div className="space-y-2">
                            <Label htmlFor="pain">Current Pain Level (0-10)</Label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0" max="10"
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2d5016]"
                                    value={formData.pain_level || 0}
                                    onChange={(e) => setFormData({ ...formData, pain_level: parseInt(e.target.value) })}
                                />
                                <span className="font-bold text-lg min-w-[2ch] text-[#2d5016]">{formData.pain_level || 0}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">0 = No Pain, 10 = Worst Pain Imaginable</p>
                        </div>
                    </div>

                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Primary Concerns & Goals</CardTitle>
                    <CardDescription>What specific issues do you want to address?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Primary Concerns Tag Input */}
                    <div className="space-y-3">
                        <Label>Primary Health Concerns</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.primary_concerns?.map((concern, i) => (
                                <Badge key={i} variant="secondary" className="pl-2 pr-1 py-1 gap-1 text-sm">
                                    {concern}
                                    <button onClick={() => removeConcern(i)} className="hover:text-red-500">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a concern (e.g. Back Pain, Anxiety)"
                                value={newConcern}
                                onChange={(e) => setNewConcern(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addConcern())}
                            />
                            <Button type="button" onClick={addConcern} variant="outline" size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Health Goals Tag Input */}
                    <div className="space-y-3">
                        <Label>Health Goals</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.health_goals?.map((goal, i) => (
                                <Badge key={i} variant="outline" className="pl-2 pr-1 py-1 gap-1 text-sm border-green-200 bg-green-50 text-green-900">
                                    {goal}
                                    <button onClick={() => removeGoal(i)} className="hover:text-red-500">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a goal (e.g. Lose Weight, Sleep Better)"
                                value={newGoal}
                                onChange={(e) => setNewGoal(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                            />
                            <Button type="button" onClick={addGoal} variant="outline" size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
