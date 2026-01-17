"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

export default function ServicesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setServices(data);
        if (error) console.error("Error fetching services:", error);
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
            const { error } = await supabase.from('services').delete().match({ id });
            if (!error) {
                setServices(services.filter(s => s.id !== id));
            } else {
                alert("Failed to delete service.");
            }
        }
    };

    const filteredServices = services.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Services</h2>
                    <p className="text-muted-foreground">Manage your clinic's offerings.</p>
                </div>
                <Button asChild className="bg-[#2d5016] text-white hover:bg-[#2d5016]/90">
                    <Link href="/admin/services/new">
                        <Plus className="w-4 h-4 mr-2" /> Add Service
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                    <CardTitle className="text-lg font-medium">Service Catalog</CardTitle>
                    <div className="relative w-[250px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search services..."
                            className="pl-9 bg-muted/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="rounded-md border-t-0">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/10 text-muted-foreground font-medium border-b">
                                    <tr>
                                        <th className="px-6 py-4">Service Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Duration</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredServices.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No services found. Add one to get started.
                                            </td>
                                        </tr>
                                    ) : filteredServices.map((service) => (
                                        <tr key={service.id} className="hover:bg-muted/5 transition-colors">
                                            <td className="px-6 py-4 font-medium">{service.name}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                                                    {service.category || 'General'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">₹{service.price}</td>
                                            <td className="px-6 py-4">{service.duration_minutes} min</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize
                                                    ${service.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        'bg-gray-50 text-gray-600 border-gray-200'}`}>
                                                    {service.status || 'draft'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDelete(service.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
