"use client";

import { useState } from "react";
import { Search, Filter, MoreVertical, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialPatients = [
    { id: 1, name: "Rahul Sharma", age: 34, gender: "Male", phone: "+91 98765 43210", lastVisit: "2024-03-15", condition: "Chronic Back Pain", status: "Active" },
    { id: 2, name: "Anjali Gupta", age: 28, gender: "Female", phone: "+91 98765 12345", lastVisit: "2024-03-20", condition: "Stress & Anxiety", status: "Active" },
    { id: 3, name: "Vikram Singh", age: 45, gender: "Male", phone: "+91 98765 67890", lastVisit: "2024-02-10", condition: "Hypertension", status: "Active" },
    { id: 4, name: "Sneha Patel", age: 52, gender: "Female", phone: "+91 98765 98765", lastVisit: "2024-03-05", condition: "Arthritis", status: "Active" },
    { id: 5, name: "Amit Kumar", age: 29, gender: "Male", phone: "+91 98765 54321", lastVisit: "2024-01-20", condition: "Insomnia", status: "Inactive" },
];

export default function PatientsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPatients = initialPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Patients</h2>
                    <p className="text-muted-foreground">Manage patient records and history.</p>
                </div>
                <Button className="bg-[#2d5016] text-white hover:bg-[#2d5016]/90">
                    + Register Patient
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <CardTitle className="text-lg font-medium">Patient Registry</CardTitle>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or phone..."
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
                                    <th className="px-6 py-4">Name / ID</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Condition</th>
                                    <th className="px-6 py-4">Last Visit</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{patient.name}</div>
                                            <div className="text-xs text-muted-foreground">ID: #00{patient.id} • {patient.gender}, {patient.age}y</div>
                                        </td>
                                        <td className="px-6 py-4">{patient.phone}</td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-50 text-orange-700 text-xs border border-orange-100">
                                                <Activity className="w-3 h-3" />
                                                {patient.condition}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{patient.lastVisit}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                ${patient.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                {patient.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#2d5016] hover:bg-[#2d5016]/10" title="View Medical History" asChild>
                                                    <Link href={`/admin/patients/${patient.id}`}>
                                                        <FileText className="h-4 w-4" />
                                                    </Link>
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
