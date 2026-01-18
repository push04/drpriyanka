"use client";

import { useEffect, useState } from "react";
import { Search, Filter, MoreVertical, FileText, Activity, Loader2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

export default function PatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'patient')
                .order('created_at', { ascending: false });

            if (data) {
                // Determine status (simple logic for now)
                const formatted = data.map(p => ({
                    id: p.id,
                    name: p.full_name || "Unknown",
                    email: p.email,
                    phone: p.phone || "N/A",
                    status: 'Active', // Default to active for now
                    joined: new Date(p.created_at).toLocaleDateString()
                }));
                setPatients(formatted);
            }
            setIsLoading(false);
        };

        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Patients</h2>
                    <p className="text-muted-foreground">Manage patient records and history.</p>
                </div>
                {/* 
                <Button className="bg-[#2d5016] text-white hover:bg-[#2d5016]/90">
                    + Register Patient
                </Button>
                */}
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <CardTitle className="text-lg font-medium">Patient Registry</CardTitle>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
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
                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/10 text-muted-foreground font-medium border-b">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Joined</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredPatients.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-muted-foreground">No patients found.</td>
                                        </tr>
                                    ) : filteredPatients.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-muted/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{patient.name}</div>
                                            </td>
                                            <td className="px-6 py-4">{patient.phone}</td>
                                            <td className="px-6 py-4">{patient.email}</td>
                                            <td className="px-6 py-4">{patient.joined}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                    ${patient.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                    {patient.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {/* In a fuller app, link to specific patient details */}
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#2d5016] hover:bg-[#2d5016]/10" title="View Details" asChild>
                                                        <Link href={`/admin/patients/${patient.id}`}>
                                                            <FileText className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
