"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Loader2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ConditionsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [conditions, setConditions] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [newName, setNewName] = useState("");
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await Promise.all([fetchConditions(), fetchServices()]);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const fetchConditions = async () => {
        try {
            const response = await fetch('/api/admin/conditions');
            const data = await response.json();
            if (response.ok && data.conditions) {
                setConditions(data.conditions);
            }
        } catch (error) {
            console.error("Error fetching conditions:", error);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await fetch('/api/admin/services');
            const data = await response.json();
            if (response.ok && data.services) {
                setServices(data.services);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/conditions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, service_id: selectedServiceId || null })
            });
            const data = await response.json();
            if (response.ok && data.condition) {
                setConditions([data.condition, ...conditions]);
                setNewName("");
                setSelectedServiceId("");
                setIsAdding(false);
            } else {
                alert("Failed to add condition: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Error adding condition:", error);
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this condition?")) return;
        try {
            const response = await fetch(`/api/admin/conditions/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setConditions(conditions.filter(c => c.id !== id));
            } else {
                alert("Failed to delete.");
            }
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const filteredConditions = conditions.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Conditions We Treat</h2>
                    <p className="text-muted-foreground">Manage the list of ailments displayed on the website.</p>
                </div>
                <Button
                    onClick={() => setIsAdding(!isAdding)}
                    className={isAdding ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-[#2d5016] text-white hover:bg-[#2d5016]/90"}
                    variant={isAdding ? "outline" : "default"}
                >
                    {isAdding ? <><X className="w-4 h-4 mr-2" /> Cancel</> : <><Plus className="w-4 h-4 mr-2" /> Add Condition</>}
                </Button>
            </div>

            {isAdding && (
                <Card className="border-2 border-[#2d5016]/20 bg-[#2d5016]/5 animate-in slide-in-from-top-4 fade-in">
                    <CardContent className="pt-6">
                        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 space-y-2 w-full">
                                <label className="text-sm font-medium">Condition Name</label>
                                <Input
                                    placeholder="e.g. Migraine"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex-1 space-y-2 w-full">
                                <label className="text-sm font-medium">Link to Treatment (Optional)</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={selectedServiceId}
                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                >
                                    <option value="">-- No Specific Treatment --</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" disabled={isSaving} className="bg-[#2d5016]">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save</>}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                    <CardTitle className="text-lg font-medium">Conditions List ({conditions.length})</CardTitle>
                    <div className="relative w-[250px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
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
                        <div className="rounded-md border-t-0 p-4">
                            <div className="flex flex-wrap gap-3">
                                {filteredConditions.length === 0 ? (
                                    <div className="text-muted-foreground w-full text-center py-8">No conditions found.</div>
                                ) : (
                                    filteredConditions.map((condition) => (
                                        <div
                                            key={condition.id}
                                            className="group flex items-center gap-2 bg-white border px-4 py-2 rounded-full shadow-sm hover:border-[#2d5016] transition-colors"
                                        >
                                            <span className="font-medium text-[#2d5016]">{condition.name}</span>
                                            {/* Show linked service name if we had joining logic, but for simplicity just show icon/dot if linked */}
                                            {condition.service_id && (
                                                <Badge variant="secondary" className="text-[10px] h-5 px-1 bg-green-50 text-green-700">Linked</Badge>
                                            )}
                                            <button
                                                onClick={() => handleDelete(condition.id)}
                                                className="text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                                                title="Delete"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
