"use client";

import { PatientHealthProfile } from "@/types/health";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Using Radix select if available, check package.json
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox"; // Removing missing component

// Simple fallback for Select if needed, but package.json showed @radix-ui/react-select so I'll try to use shadcn Select if components exist.
// If components don't exist, I'll fallback to native <select>.
// Given I created Tabs manually, I'll assume I might need to create Select manually or use native for speed and reliability unless I see the file.
// I'll stick to NATIVE select for reliability in this specific file unless I verify UI components.
// Actually, I'll check if components/ui/select.tsx exists. If not, I'll use native.

interface SectionProps {
    formData: Partial<PatientHealthProfile>;
    setFormData: (data: Partial<PatientHealthProfile>) => void;
}

export default function LifestyleSection({ formData, setFormData }: SectionProps) {

    const updateHabit = (habit: 'smoking' | 'alcohol' | 'caffeine', value: string) => {
        setFormData({
            ...formData,
            habits: { ...formData.habits!, [habit]: value }
        });
    };

    const updateSleep = (field: 'hours_per_night' | 'quality', value: any) => {
        setFormData({
            ...formData,
            sleep_pattern: { ...formData.sleep_pattern!, [field]: value }
        });
    };

    const updateOccupation = (field: 'job_title' | 'schedule_type' | 'screen_time_hours', value: any) => {
        setFormData({
            ...formData,
            occupation_details: { ...formData.occupation_details!, [field]: value }
        });
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Diet & Nutrition</CardTitle>
                    <CardDescription>Your eating habits play a major role in your health.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Dietary Preference</Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.dietary_preferences || ""}
                            onChange={(e) => setFormData({ ...formData, dietary_preferences: e.target.value })}
                        >
                            <option value="">Select...</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="vegan">Vegan</option>
                            <option value="jain">Jain (No Onion/Garlic)</option>
                            <option value="non-vegetarian">Non-Vegetarian</option>
                            <option value="eggetarian">Eggetarian</option>
                            <option value="gluten-free">Gluten Free</option>
                            <option value="keto">Keto/Paleo</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Daily Hydration (Liters)</Label>
                        <Input
                            type="number"
                            step="0.5"
                            placeholder="e.g. 2.5"
                            value={formData.hydration_liters || ""}
                            onChange={(e) => setFormData({ ...formData, hydration_liters: parseFloat(e.target.value) })}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label>Typical Meal Pattern</Label>
                        <Textarea
                            placeholder="Breakfast: Oatmeal, Lunch: Roti/Sabzi..."
                            value={formData.meal_pattern || ""}
                            onChange={(e) => setFormData({ ...formData, meal_pattern: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Lifestyle & Habits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label>Activity Level</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.activity_level || ""}
                                onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
                            >
                                <option value="sedentary">Sedentary (Desk Job)</option>
                                <option value="light">Lightly Active</option>
                                <option value="moderate">Moderately Active</option>
                                <option value="very_active">Very Active</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Smoking</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.habits?.smoking || "never"}
                                onChange={(e) => updateHabit('smoking', e.target.value)}
                            >
                                <option value="never">Never</option>
                                <option value="past">Past Smoker</option>
                                <option value="current">Current Smoker</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Alcohol</Label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.habits?.alcohol || "never"}
                                onChange={(e) => updateHabit('alcohol', e.target.value)}
                            >
                                <option value="never">Never</option>
                                <option value="occasional">Occasional</option>
                                <option value="regular">Regular</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Sleep Quality & Duration</Label>
                        <div className="flex gap-4">
                            <div className="w-1/3">
                                <Input
                                    type="number"
                                    placeholder="Hours"
                                    value={formData.sleep_pattern?.hours_per_night || ""}
                                    onChange={(e) => updateSleep('hours_per_night', parseFloat(e.target.value))}
                                />
                            </div>
                            <select
                                className="flex-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.sleep_pattern?.quality || "good"}
                                onChange={(e) => updateSleep('quality', e.target.value)}
                            >
                                <option value="good">Good / Restful</option>
                                <option value="fair">Fair / Disturbed</option>
                                <option value="poor">Poor / Insomnia</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Stress Level (1-10)</Label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1" max="10"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2d5016]"
                                value={formData.stress_level || 1}
                                onChange={(e) => setFormData({ ...formData, stress_level: parseInt(e.target.value) })}
                            />
                            <span className="font-bold text-lg text-[#2d5016]">{formData.stress_level || 1}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Occupation</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Job Title</Label>
                        <Input
                            value={formData.occupation_details?.job_title || ""}
                            onChange={(e) => updateOccupation('job_title', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Daily Screen Time (Hours)</Label>
                        <Input
                            type="number"
                            value={formData.occupation_details?.screen_time_hours || ""}
                            onChange={(e) => updateOccupation('screen_time_hours', parseFloat(e.target.value))}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
