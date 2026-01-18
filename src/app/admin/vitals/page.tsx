"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VitalsReviewPage() {
    const [metrics, setMetrics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/vitals');
            const data = await response.json();

            if (response.ok && data.metrics) {
                setMetrics(data.metrics);
            }
        } catch (error) {
            console.error('Error fetching health metrics:', error);
        }
        setLoading(false);
    };

    const filteredMetrics = metrics.filter(m =>
        m.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.metric_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Vitals Review</h2>
                    <p className="text-muted-foreground">Monitor patient reported health metrics.</p>
                </div>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                    <CardTitle className="text-lg font-medium">Recent Logs</CardTitle>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search patient or metric..."
                                className="pl-9 w-[250px] bg-muted/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-md border-t-0">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/10 text-muted-foreground font-medium border-b">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Patient</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Metric</th>
                                        <th className="px-6 py-4">Value</th>
                                        <th className="px-6 py-4">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredMetrics.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-muted-foreground">No records found.</td>
                                        </tr>
                                    ) : (
                                        filteredMetrics.map((record) => (
                                            <tr key={record.id} className="hover:bg-muted/5 transition-colors">
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {new Date(record.recorded_at).toLocaleDateString()} <br />
                                                    <span className="text-xs">{new Date(record.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    {record.profiles?.full_name || "Unknown"}
                                                </td>
                                                <td className="px-6 py-4 capitalize badge">
                                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                                        {record.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 capitalize font-medium text-gray-800">
                                                    {record.metric_name.replace('_', ' ')}
                                                </td>
                                                <td className="px-6 py-4 font-bold text-[#2d5016]">
                                                    {record.value_numeric} <span className="text-xs text-muted-foreground font-normal">{record.unit}</span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground max-w-[200px] truncate" title={record.notes}>
                                                    {record.notes || "-"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
