"use client";

import { useState } from "react";
import { Download, FileText, Search, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock Invoice Data
const initialInvoices = [
    { id: "INV-001", patient: "Rahul Sharma", date: "2024-03-20", amount: 1500, status: "Paid", service: "Therapeutic Yoga" },
    { id: "INV-002", patient: "Anjali Gupta", date: "2024-03-19", amount: 2000, status: "Paid", service: "Hydrotherapy" },
    { id: "INV-003", patient: "Vikram Singh", date: "2024-03-18", amount: 1200, status: "Pending", service: "Massage" },
    { id: "INV-004", patient: "Sneha Patel", date: "2024-03-15", amount: 1000, status: "Overdue", service: "Consultation" },
];

export default function InvoicesPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredInvoices = initialInvoices.filter(inv =>
        inv.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Invoices & Payments</h2>
                    <p className="text-muted-foreground">Track revenue and patient payments.</p>
                </div>
                <Button className="bg-[#2d5016] text-white hover:bg-[#2d5016]/90">
                    <Plus className="w-4 h-4 mr-2" /> Create Invoice
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-green-600 mb-2">Total Revenue (This Month)</div>
                        <div className="text-3xl font-bold text-green-800">₹45,200</div>
                    </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-100">
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-orange-600 mb-2">Pending Payments</div>
                        <div className="text-3xl font-bold text-orange-800">₹8,500</div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-blue-600 mb-2">Invoices Generated</div>
                        <div className="text-3xl font-bold text-blue-800">124</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                    <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
                    <div className="relative w-[250px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search invoice or patient..."
                            className="pl-9 bg-muted/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-md border-t-0">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/10 text-muted-foreground font-medium border-b">
                                <tr>
                                    <th className="px-6 py-4">Invoice ID</th>
                                    <th className="px-6 py-4">Patient</th>
                                    <th className="px-6 py-4">Service</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredInvoices.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-muted/5 transition-colors">
                                        <td className="px-6 py-4 font-medium font-mono">{inv.id}</td>
                                        <td className="px-6 py-4">{inv.patient}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{inv.service}</td>
                                        <td className="px-6 py-4">{inv.date}</td>
                                        <td className="px-6 py-4 font-bold">₹{inv.amount}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={`
                                                ${inv.status === 'Paid' ? 'border-green-200 bg-green-50 text-green-700' :
                                                    inv.status === 'Pending' ? 'border-orange-200 bg-orange-50 text-orange-700' :
                                                        'border-red-200 bg-red-50 text-red-700'}
                                            `}>
                                                {inv.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                    <FileText className="h-4 w-4" />
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
