"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Search, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({ revenue: 0, pending: 0, count: 0 });

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .order('issued_date', { ascending: false });

        if (data) {
            setInvoices(data);

            // Calculate Stats
            const revenue = data.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount), 0);
            const pending = data.filter(i => i.status === 'pending').reduce((sum, i) => sum + Number(i.amount), 0);
            setStats({ revenue, pending, count: data.length });
        }
        setIsLoading(false);
    };

    // Helper to Create a Demo Invoice (Since we don't have a full UI for it yet)
    const createDemoInvoice = async () => {
        const { error } = await supabase.from('invoices').insert({
            patient_name: "Fresh Demo Patient",
            service_name: "General Checkup",
            amount: 1500,
            status: "pending",
            issued_date: new Date().toISOString().split('T')[0]
        });
        if (!error) fetchInvoices();
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.patient_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Invoices & Payments</h2>
                    <p className="text-muted-foreground">Track revenue and patient payments.</p>
                </div>
                {/* Temporary 'Quick Add' for testing until full form is built */}
                <Button onClick={createDemoInvoice} className="bg-[#2d5016] text-white hover:bg-[#2d5016]/90">
                    <Plus className="w-4 h-4 mr-2" /> Quick Create Demo Invoice
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-green-600 mb-2">Total Revenue</div>
                        <div className="text-3xl font-bold text-green-800">₹{stats.revenue.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-orange-50 border-orange-100">
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-orange-600 mb-2">Pending Payments</div>
                        <div className="text-3xl font-bold text-orange-800">₹{stats.pending.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="p-6">
                        <div className="text-sm font-medium text-blue-600 mb-2">Invoices Generated</div>
                        <div className="text-3xl font-bold text-blue-800">{stats.count}</div>
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
                        {isLoading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/10 text-muted-foreground font-medium border-b">
                                    <tr>
                                        <th className="px-6 py-4">Patient</th>
                                        <th className="px-6 py-4">Service</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredInvoices.length === 0 ? (
                                        <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No invoices found.</td></tr>
                                    ) : filteredInvoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-muted/5 transition-colors">
                                            <td className="px-6 py-4 font-medium">{inv.patient_name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{inv.service_name}</td>
                                            <td className="px-6 py-4">{inv.issued_date}</td>
                                            <td className="px-6 py-4 font-bold">₹{inv.amount}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={`
                                                capitalize
                                                ${inv.status === 'paid' ? 'border-green-200 bg-green-50 text-green-700' :
                                                        inv.status === 'pending' ? 'border-orange-200 bg-orange-50 text-orange-700' :
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
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
