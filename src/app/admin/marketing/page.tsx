"use client";

import { useState, useEffect } from "react";
import { Mail, Download, Loader2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function MarketingPage() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const fetchSubscribers = async () => {
        try {
            const response = await fetch('/api/admin/marketing');
            const data = await response.json();
            if (response.ok && data.subscribers) {
                setSubscribers(data.subscribers);
            }
        } catch (error) {
            console.error("Error fetching subscribers:", error);
        }
        setIsLoading(false);
    };

    const copyAllEmails = () => {
        const allEmails = subscribers.map(s => s.email).join(', ');
        navigator.clipboard.writeText(allEmails);
        alert("Copied " + subscribers.length + " emails to clipboard!");
    };

    const downloadCSV = () => {
        const headers = ["Email", "Status", "Joined Date"];
        const rows = subscribers.map(s => [
            s.email,
            s.status,
            s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString() : '-'
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "newsletter_subscribers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Marketing & Newsletter</h2>
                    <p className="text-muted-foreground">Manage your email subscribers for future campaigns.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={copyAllEmails}>
                        <Copy className="w-4 h-4 mr-2" /> Copy Emails
                    </Button>
                    <Button className="bg-[#2d5016]" onClick={downloadCSV}>
                        <Download className="w-4 h-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Subscribers</CardTitle>
                        <Mail className="h-4 w-4 text-[#2d5016]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subscribers.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Subscriber List</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="p-4 font-medium">Email</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscribers.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="p-4 text-center text-muted-foreground">
                                                No subscribers yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        subscribers.map((sub, i) => (
                                            <tr key={sub.id || i} className="border-t hover:bg-muted/5">
                                                <td className="p-4 font-medium">{sub.email}</td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                        {sub.status || 'Active'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-muted-foreground">
                                                    {sub.subscribed_at ? format(new Date(sub.subscribed_at), 'MMM d, yyyy') : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
