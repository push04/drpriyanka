"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Phone, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewAppointmentPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [services, setServices] = useState<any[]>([]);

    // Form Stats
    const [guestName, setGuestName] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [serviceId, setServiceId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    useEffect(() => {
        // Fetch Services for dropdown
        const fetchServices = async () => {
            const { data } = await supabase.from('services').select('id, name').eq('status', 'active');
            if (data) setServices(data);
        };
        fetchServices();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase.from('appointments').insert({
            patient_name: guestName,
            patient_phone: guestPhone,
            service_id: serviceId,
            start_time: `${date}T${time}:00`,
            end_time: `${date}T${time}:00`, // Placeholder duration
            status: 'confirmed',
            notes: 'Manual booking via Admin Panel'
        });

        if (error) {
            alert("Failed to create appointment: " + error.message);
            setIsLoading(false);
        } else {
            router.push("/admin/appointments");
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/admin/appointments">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">New Appointment</h2>
                    <p className="text-muted-foreground">Manually book a session for a patient.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Booking Details</CardTitle>
                        <CardDescription>Enter patient and schedule information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Patient Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Patient Info</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="e.g. John Doe"
                                            className="pl-9"
                                            required
                                            value={guestName}
                                            onChange={(e) => setGuestName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="+91 98765..."
                                            className="pl-9"
                                            required
                                            value={guestPhone}
                                            onChange={(e) => setGuestPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4 space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Service & Time</h3>

                            <div className="space-y-2">
                                <Label>Select Service</Label>
                                <Select required onValueChange={setServiceId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a therapy..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {services.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="date"
                                            className="pl-9"
                                            required
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Time</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="time"
                                            className="pl-9"
                                            required
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isLoading} className="bg-[#2d5016] hover:bg-[#2d5016]/90">
                                {isLoading ? "Confirming..." : "Confirm Booking"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
