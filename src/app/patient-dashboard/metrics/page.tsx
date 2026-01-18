"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Thermometer, Scale, CheckCircle2 } from "lucide-react";

export default function MetricsPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [category, setCategory] = useState("vitals");
    const [metric, setMetric] = useState("");
    const [value, setValue] = useState("");
    const [unit, setUnit] = useState("");
    const [notes, setNotes] = useState("");
    const [userId, setUserId] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                setUserId(data.user.id);
            } else {
                router.push('/login');
            }
        };
        getUser();
    }, [router]);

    const handleCategoryChange = (val: string) => {
        setCategory(val);
        setMetric("");
        setUnit("");
    };

    const handleMetricChange = (val: string) => {
        setMetric(val);
        // Auto-set unit
        switch (val) {
            case "weight": setUnit("kg"); break;
            case "temp": setUnit("°F"); break;
            case "bp_sys": setUnit("mmHg"); break;
            case "bp_dia": setUnit("mmHg"); break;
            case "sugar_fasting": setUnit("mg/dL"); break;
            default: setUnit("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setLoading(true);
        try {
            const res = await fetch('/api/patient/metrics/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: userId,
                    category,
                    metricName: metric,
                    valueNumeric: parseFloat(value),
                    unit,
                    notes
                })
            });

            if (!res.ok) throw new Error('Failed to log');

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setValue("");
            setNotes("");
        } catch (err) {
            console.error(err);
            alert("Failed to log metric.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-[#2d5016]">Health Metrics</h1>
                <p className="text-muted-foreground">Log your daily vitals to track your progress.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Log New Reading
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-2 mb-4">
                            <CheckCircle2 className="w-5 h-5" />
                            Reading logged successfully!
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select value={category} onValueChange={handleCategoryChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vitals">Vitals (BP, HR, Temp)</SelectItem>
                                        <SelectItem value="composition">Body Composition</SelectItem>
                                        <SelectItem value="diabetes">Blood Sugar / Diabetes</SelectItem>
                                        <SelectItem value="pain">Pain Scale</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Metric</label>
                                <Select value={metric} onValueChange={handleMetricChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Metric" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {category === 'vitals' && (
                                            <>
                                                <SelectItem value="bp_sys">BP Systolic</SelectItem>
                                                <SelectItem value="bp_dia">BP Diastolic</SelectItem>
                                                <SelectItem value="heart_rate">Heart Rate</SelectItem>
                                                <SelectItem value="temp">Body Temperature</SelectItem>
                                                <SelectItem value="spo2">Oxygen (SpO2)</SelectItem>
                                            </>
                                        )}
                                        {category === 'composition' && (
                                            <>
                                                <SelectItem value="weight">Weight</SelectItem>
                                                <SelectItem value="bmi">BMI</SelectItem>
                                            </>
                                        )}
                                        {category === 'diabetes' && (
                                            <>
                                                <SelectItem value="sugar_fasting">Fasting Sugar</SelectItem>
                                                <SelectItem value="sugar_pp">PP Sugar (Post-meal)</SelectItem>
                                                <SelectItem value="sugar_random">Random Sugar</SelectItem>
                                            </>
                                        )}
                                        {category === 'pain' && (
                                            <>
                                                <SelectItem value="pain_general">General Pain (1-10)</SelectItem>
                                                <SelectItem value="pain_back">Back Pain (1-10)</SelectItem>
                                                <SelectItem value="pain_joint">Joint Pain (1-10)</SelectItem>
                                            </>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Value</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 120"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Unit</label>
                                <Input
                                    placeholder="Unit (e.g. mmHg)"
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notes (Optional)</label>
                            <Textarea
                                placeholder="Any specific context? e.g. 'After morning walk'"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Logging..." : "Log Metric"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
