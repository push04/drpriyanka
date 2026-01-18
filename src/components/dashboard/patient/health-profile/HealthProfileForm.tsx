"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { PatientHealthProfile, HealthProfileSection } from "@/types/health";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, FileText, Activity, Heart, Users, Utensils, Baby } from "lucide-react";

// Imported Sections
import ChiefComplaintSection from "./ChiefComplaintSection";
import MedicalHistorySection from "./MedicalHistorySection";
import LifestyleSection from "./LifestyleSection";
import AllergiesSection from "./AllergiesSection";
import FamilyHistorySection from "./FamilyHistorySection";
import WomensHealthSection from "./WomensHealthSection";

export default function HealthProfileForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<HealthProfileSection>("basic");

    // Initial State
    const [formData, setFormData] = useState<Partial<PatientHealthProfile>>({
        chief_complaint: "",
        primary_concerns: [],
        health_goals: [],
        condition_duration: "",
        pain_level: 0,
        surgeries: [],
        hospitalizations: [],
        chronic_conditions: [],
        current_medications: [],
        supplements: "",
        previous_treatments: "",
        allergies: { drug: [], food: [], environmental: [], skin: [] },
        family_history: {},
        dietary_preferences: "",
        meal_pattern: "",
        hydration_liters: 0,
        habits: { smoking: "never", alcohol: "never", caffeine: "none" },
        activity_level: "sedentary",
        sleep_pattern: { hours_per_night: 7, quality: "good", issues: [] },
        stress_level: 1,
        mental_health_history: "",
        occupation_details: { job_title: "", schedule_type: "9-5", screen_time_hours: 0 },
        menstrual_history: { cycle_regularity: "na", issues: [] },
        consent_agreed: false
    });

    useEffect(() => {
        fetchHealthProfile();
    }, []);

    const fetchHealthProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const response = await fetch('/api/patient/health-profile', { headers });
            const data = await response.json();

            if (response.ok && data.profile) {
                setFormData(data.profile);
            } else if (!response.ok && response.status !== 401) {
                console.error("Error fetching health profile:", data.error);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: HeadersInit = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const response = await fetch('/api/patient/health-profile', {
                method: 'POST',
                headers,
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save profile');
            }

            alert("Health profile updated successfully!");

        } catch (error: any) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-[#2d5016]" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-serif font-bold text-[#2d5016]">My Health Profile</h1>
                <p className="text-muted-foreground mt-2">
                    Please complete this form to help us provide you with the best personalized care.
                    Your information is secure and private.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as HealthProfileSection)} className="w-full">
                <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2 w-full h-auto p-1 bg-muted/50 rounded-lg">
                    <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:text-[#2d5016] data-[state=active]:shadow-sm">
                        <FileText className="w-4 h-4 mr-2" /> Basic
                    </TabsTrigger>
                    <TabsTrigger value="medical" className="data-[state=active]:bg-white data-[state=active]:text-[#2d5016] data-[state=active]:shadow-sm">
                        <Activity className="w-4 h-4 mr-2" /> History
                    </TabsTrigger>
                    <TabsTrigger value="allergies" className="data-[state=active]:bg-white data-[state=active]:text-[#2d5016] data-[state=active]:shadow-sm">
                        <Loader2 className="w-4 h-4 mr-2" /> Allergies
                    </TabsTrigger>
                    <TabsTrigger value="family" className="data-[state=active]:bg-white data-[state=active]:text-[#2d5016] data-[state=active]:shadow-sm">
                        <Users className="w-4 h-4 mr-2" /> Family
                    </TabsTrigger>
                    <TabsTrigger value="lifestyle" className="data-[state=active]:bg-white data-[state=active]:text-[#2d5016] data-[state=active]:shadow-sm">
                        <Utensils className="w-4 h-4 mr-2" /> Lifestyle
                    </TabsTrigger>
                    <TabsTrigger value="womens_health" className="data-[state=active]:bg-white data-[state=active]:text-[#2d5016] data-[state=active]:shadow-sm">
                        <Baby className="w-4 h-4 mr-2" /> Women
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="basic">
                        <ChiefComplaintSection formData={formData} setFormData={setFormData} />
                    </TabsContent>

                    <TabsContent value="medical">
                        <MedicalHistorySection formData={formData} setFormData={setFormData} />
                    </TabsContent>

                    <TabsContent value="allergies">
                        <AllergiesSection formData={formData} setFormData={setFormData} />
                    </TabsContent>

                    <TabsContent value="family">
                        <FamilyHistorySection formData={formData} setFormData={setFormData} />
                    </TabsContent>

                    <TabsContent value="lifestyle">
                        <LifestyleSection formData={formData} setFormData={setFormData} />
                    </TabsContent>

                    <TabsContent value="womens_health">
                        <WomensHealthSection formData={formData} setFormData={setFormData} />
                    </TabsContent>
                </div>
            </Tabs>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg md:relative md:bg-transparent md:border-t-0 md:shadow-none md:p-0 flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[#2d5016] hover:bg-[#2d5016]/90 text-white min-w-[200px]"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" /> Save Profile
                        </>
                    )}
                </Button>
            </div>
            {/* Added spacer for mobile fab */}
            <div className="h-20 md:hidden"></div>
        </div>
    );
}
