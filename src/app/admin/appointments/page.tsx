"use client";

import { useState } from "react";
import { Check, X, Clock, MoreVertical, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock Data - In a real app, this would come from Supabase
const initialAppointments = [
    { id: 1, patient: "Rahul Sharma", service: "Therapeutic Yoga", date: "2024-03-20", time: "10:00 AM", status: "Confirmed", phone: "+91 98765 43210" },
    { id: 2, patient: "Anjali Gupta", service: "Hydrotherapy", date: "2024-03-20", time: "11:30 AM", status: "Checked In", phone: "+91 98765 12345" },
    { id: 3, patient: "Vikram Singh", service: "Ayurvedic Massage", date: "2024-03-20", time: "02:00 PM", status: "Pending", phone: "+91 98765 67890" },
    { id: 4, patient: "Sneha Patel", service: "Consultation", date: "2024-03-20", time: "04:00 PM", status: "Confirmed", phone: "+91 98765 98765" },
    { id: 5, patient: "Amit Kumar", service: "Acupuncture", date: "2024-03-21", time: "09:00 AM", status: "Pending", phone: "+91 98765 54321" },
    { id: 6, patient: "Priya Desai", service: "Mud Therapy", date: "2024-03-21", time: "11:00 AM", status: "Cancelled", phone: "+91 98765 11223" },
];

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredAppointments = appointments.filter(apt =>
        apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Appointments</h2>
                    <p className="text-muted-foreground">Manage your clinic's schedule.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button className="bg-[#2d5016] text-white hover:bg-[#2d5016]/90">
                        + New Booking
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <CardTitle className="text-lg font-medium">All Bookings</CardTitle>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search patient or service..."
                                className="pl-9 w-[250px] bg-muted/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-md border-t-0">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/10 text-muted-foreground font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">Patient</th>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredAppointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-6 py-4 font-medium">
                                            <div>{apt.patient}</div>
                                            <div className="text-xs text-muted-foreground">{apt.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">{apt.service}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                <span>{apt.date}, {apt.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                ${apt.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    apt.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        apt.status === 'Checked In' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
