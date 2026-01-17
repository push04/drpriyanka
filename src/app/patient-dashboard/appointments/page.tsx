"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

const appointments = [
    {
        id: 1,
        service: "Therapeutic Yoga",
        date: "Today, Jan 17",
        time: "4:00 PM",
        duration: "60 min",
        status: "Upcoming",
        doctor: "Dr. Priyanka"
    },
    {
        id: 2,
        service: "Mud Therapy",
        date: "Jan 24, 2026",
        time: "10:00 AM",
        duration: "45 min",
        status: "Confirmed",
        doctor: "Dr. Priyanka"
    },
    {
        id: 3,
        service: "Initial Consultation",
        date: "Jan 10, 2026",
        time: "11:00 AM",
        duration: "30 min",
        status: "Completed",
        doctor: "Dr. Priyanka"
    }
];

export default function PatientAppointments() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">My Appointments</h2>
                    <p className="text-muted-foreground">Manage your upcoming and past sessions.</p>
                </div>
                <Button className="bg-[#2d5016]">Book New Appointment</Button>
            </div>

            <div className="space-y-4">
                {appointments.map((apt) => (
                    <Card key={apt.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className={`w-full md:w-2 bg-[#2d5016] ${apt.status === 'Completed' ? 'opacity-30' : ''}`} />
                            <div className="p-6 flex-1 grid md:grid-cols-3 gap-4 items-center">
                                <div>
                                    <div className="font-bold text-lg">{apt.service}</div>
                                    <div className="text-muted-foreground text-sm">with {apt.doctor}</div>
                                    <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium 
                                        ${apt.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                                            apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'}`}>
                                        {apt.status}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span>{apt.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        <span>{apt.time} ({apt.duration})</span>
                                    </div>
                                </div>

                                <div className="flex md:justify-end gap-2">
                                    {apt.status !== 'Completed' && (
                                        <>
                                            <Button variant="outline" size="sm">Reschedule</Button>
                                            <Button variant="destructive" size="sm" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100">Cancel</Button>
                                        </>
                                    )}
                                    {apt.status === 'Completed' && (
                                        <Button variant="outline" size="sm">View Summary</Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
