"use client";

import { PatientHealthProfile, AllergyProfile } from "@/types/health";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface SectionProps {
    formData: Partial<PatientHealthProfile>;
    setFormData: (data: Partial<PatientHealthProfile>) => void;
}

type AllergyCategory = keyof Omit<AllergyProfile, 'severity'>;

export default function AllergiesSection({ formData, setFormData }: SectionProps) {
    const [newAllergy, setNewAllergy] = useState<{ category: AllergyCategory; name: string }>({
        category: 'drug',
        name: ''
    });

    const addAllergy = () => {
        if (!newAllergy.name.trim()) return;

        const category = newAllergy.category;
        const currentAllergies = formData.allergies || { drug: [], food: [], environmental: [], skin: [] };
        const currentList = currentAllergies[category] || [];

        setFormData({
            ...formData,
            allergies: {
                ...currentAllergies,
                [category]: [...currentList, newAllergy.name.trim()]
            }
        });
        setNewAllergy({ ...newAllergy, name: '' });
    };

    const removeAllergy = (category: AllergyCategory, index: number) => {
        const currentAllergies = formData.allergies || { drug: [], food: [], environmental: [], skin: [] };
        const currentList = [...(currentAllergies[category] || [])];

        currentList.splice(index, 1);

        setFormData({
            ...formData,
            allergies: {
                ...currentAllergies,
                [category]: currentList
            }
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Allergies & Sensitivities</CardTitle>
                    <CardDescription>Do you have any known allergies?</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">

                    {/* Drug Allergies */}
                    <div className="space-y-3">
                        <Label className="text-red-600 font-medium">Drug/Medication Allergies</Label>
                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-red-50/20">
                            {formData.allergies?.drug?.map((item, i) => (
                                <Badge key={i} variant="destructive" className="pl-2 pr-1 py-1 gap-1">
                                    {item}
                                    <button onClick={() => removeAllergy('drug', i)} className="hover:text-black/50">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            {(!formData.allergies?.drug?.length) && <span className="text-muted-foreground text-xs p-1">None listed</span>}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add drug..."
                                value={newAllergy.category === 'drug' ? newAllergy.name : ''}
                                onChange={(e) => setNewAllergy({ category: 'drug', name: e.target.value })}
                                onFocus={() => setNewAllergy({ ...newAllergy, category: 'drug' })}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                            />
                            <Button type="button" onClick={addAllergy} size="icon" variant="outline"><Plus className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    {/* Food Allergies */}
                    <div className="space-y-3">
                        <Label className="text-orange-600 font-medium">Food Allergies</Label>
                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-orange-50/20">
                            {formData.allergies?.food?.map((item, i) => (
                                <Badge key={i} className="pl-2 pr-1 py-1 gap-1 bg-orange-100 text-orange-800 hover:bg-orange-200">
                                    {item}
                                    <button onClick={() => removeAllergy('food', i)} className="hover:text-black/50">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            {(!formData.allergies?.food?.length) && <span className="text-muted-foreground text-xs p-1">None listed</span>}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add food..."
                                value={newAllergy.category === 'food' ? newAllergy.name : ''}
                                onChange={(e) => setNewAllergy({ category: 'food', name: e.target.value })}
                                onFocus={() => setNewAllergy({ ...newAllergy, category: 'food' })}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                            />
                            <Button type="button" onClick={addAllergy} size="icon" variant="outline"><Plus className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    {/* Environmental */}
                    <div className="space-y-3">
                        <Label className="text-blue-600 font-medium">Environmental (Dust, Pollen)</Label>
                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-blue-50/20">
                            {formData.allergies?.environmental?.map((item, i) => (
                                <Badge key={i} className="pl-2 pr-1 py-1 gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                                    {item}
                                    <button onClick={() => removeAllergy('environmental', i)} className="hover:text-black/50">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            {(!formData.allergies?.environmental?.length) && <span className="text-muted-foreground text-xs p-1">None listed</span>}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add agent..."
                                value={newAllergy.category === 'environmental' ? newAllergy.name : ''}
                                onChange={(e) => setNewAllergy({ category: 'environmental', name: e.target.value })}
                                onFocus={() => setNewAllergy({ ...newAllergy, category: 'environmental' })}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                            />
                            <Button type="button" onClick={addAllergy} size="icon" variant="outline"><Plus className="h-4 w-4" /></Button>
                        </div>
                    </div>

                    {/* Skin */}
                    <div className="space-y-3">
                        <Label className="text-purple-600 font-medium">Skin Sensitivities</Label>
                        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md bg-purple-50/20">
                            {formData.allergies?.skin?.map((item, i) => (
                                <Badge key={i} className="pl-2 pr-1 py-1 gap-1 bg-purple-100 text-purple-800 hover:bg-purple-200">
                                    {item}
                                    <button onClick={() => removeAllergy('skin', i)} className="hover:text-black/50">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            {(!formData.allergies?.skin?.length) && <span className="text-muted-foreground text-xs p-1">None listed</span>}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add item..."
                                value={newAllergy.category === 'skin' ? newAllergy.name : ''}
                                onChange={(e) => setNewAllergy({ category: 'skin', name: e.target.value })}
                                onFocus={() => setNewAllergy({ ...newAllergy, category: 'skin' })}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                            />
                            <Button type="button" onClick={addAllergy} size="icon" variant="outline"><Plus className="h-4 w-4" /></Button>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
