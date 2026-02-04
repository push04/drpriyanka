"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Testimonial {
    id: string;
    name: string;
    quote: string;
    role: string;
    rating: number;
    is_active: boolean;
}

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Settings state
    const [settings, setSettings] = useState({
        clinic_name: "",
        clinic_tagline: "",
        contact_phone_1: "",
        contact_phone_2: "",
        contact_email: "",
        contact_address: "",
        clinic_hours_morning: "",
        clinic_hours_evening: "",
        about_title: "",
        about_subtitle: "",
        about_description: "",
        about_mission: "",
        social_facebook: "",
        social_instagram: "",
        social_youtube: "",
    });

    // Testimonials state
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [newTestimonial, setNewTestimonial] = useState({ name: "", quote: "", role: "Patient", rating: 5 });
    const [showAddTestimonial, setShowAddTestimonial] = useState(false);

    // Fetch settings and testimonials on load
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [settingsRes, testimonialsRes] = await Promise.all([
                    fetch('/api/admin/settings'),
                    fetch('/api/admin/testimonials')
                ]);

                const settingsData = await settingsRes.json();
                const testimonialsData = await testimonialsRes.json();

                if (settingsData.settings) {
                    // Parse JSON strings from database
                    const parsed: any = {};
                    Object.entries(settingsData.settings).forEach(([key, value]) => {
                        try {
                            parsed[key] = typeof value === 'string' ? JSON.parse(value) : value;
                        } catch {
                            parsed[key] = value;
                        }
                    });
                    setSettings(prev => ({ ...prev, ...parsed }));
                }

                if (testimonialsData.testimonials) {
                    setTestimonials(testimonialsData.testimonials);
                }
            } catch (error) {
                console.error("Error loading settings:", error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings })
            });

            if (!response.ok) throw new Error('Failed to save');

            setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error) {
            setSaveMessage({ type: 'error', text: 'Failed to save settings' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddTestimonial = async () => {
        if (!newTestimonial.name || !newTestimonial.quote) return;

        try {
            const response = await fetch('/api/admin/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTestimonial)
            });

            const data = await response.json();
            if (data.testimonial) {
                setTestimonials([data.testimonial, ...testimonials]);
                setNewTestimonial({ name: "", quote: "", role: "Patient", rating: 5 });
                setShowAddTestimonial(false);
            }
        } catch (error) {
            console.error("Error adding testimonial:", error);
        }
    };

    const handleUpdateTestimonial = async () => {
        if (!editingTestimonial) return;

        try {
            const response = await fetch('/api/admin/testimonials', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingTestimonial)
            });

            const data = await response.json();
            if (data.testimonial) {
                setTestimonials(testimonials.map(t => t.id === data.testimonial.id ? data.testimonial : t));
                setEditingTestimonial(null);
            }
        } catch (error) {
            console.error("Error updating testimonial:", error);
        }
    };

    const handleDeleteTestimonial = async (id: string) => {
        if (!confirm("Delete this testimonial?")) return;

        try {
            const response = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                setTestimonials(testimonials.filter(t => t.id !== id));
            }
        } catch (error) {
            console.error("Error deleting testimonial:", error);
        }
    };

    const updateSetting = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Settings</h2>
                    <p className="text-muted-foreground">Manage clinic preferences and all site content.</p>
                </div>
                <div className="flex items-center gap-4">
                    {saveMessage && (
                        <span className={`text-sm ${saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {saveMessage.text}
                        </span>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-[#2d5016] text-white hover:bg-[#2d5016]/90"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {isSaving ? "Saving..." : "Save All Changes"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Clinic Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle>Clinic Profile</CardTitle>
                        <CardDescription>Basic information about your clinic.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Clinic Name</Label>
                                <Input
                                    value={settings.clinic_name}
                                    onChange={(e) => updateSetting('clinic_name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tagline</Label>
                                <Input
                                    value={settings.clinic_tagline}
                                    onChange={(e) => updateSetting('clinic_tagline', e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                        <CardDescription>This information appears in the footer, contact page, etc.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Phone 1</Label>
                                <Input
                                    value={settings.contact_phone_1}
                                    onChange={(e) => updateSetting('contact_phone_1', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone 2</Label>
                                <Input
                                    value={settings.contact_phone_2}
                                    onChange={(e) => updateSetting('contact_phone_2', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={settings.contact_email}
                                    onChange={(e) => updateSetting('contact_email', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Address</Label>
                                <Input
                                    value={settings.contact_address}
                                    onChange={(e) => updateSetting('contact_address', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Morning Hours</Label>
                                <Input
                                    value={settings.clinic_hours_morning}
                                    onChange={(e) => updateSetting('clinic_hours_morning', e.target.value)}
                                    placeholder="e.g., 11:00 AM - 01:00 PM"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Evening Hours</Label>
                                <Input
                                    value={settings.clinic_hours_evening}
                                    onChange={(e) => updateSetting('clinic_hours_evening', e.target.value)}
                                    placeholder="e.g., 06:00 PM - 08:00 PM"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* About Page Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>About Page Content</CardTitle>
                        <CardDescription>Content displayed on the About page.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={settings.about_title}
                                    onChange={(e) => updateSetting('about_title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Subtitle</Label>
                                <Input
                                    value={settings.about_subtitle}
                                    onChange={(e) => updateSetting('about_subtitle', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={settings.about_description}
                                onChange={(e) => updateSetting('about_description', e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Mission Statement</Label>
                            <Textarea
                                value={settings.about_mission}
                                onChange={(e) => updateSetting('about_mission', e.target.value)}
                                rows={2}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                    <CardHeader>
                        <CardTitle>Social Media Links</CardTitle>
                        <CardDescription>Leave empty to hide in footer.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Facebook URL</Label>
                                <Input
                                    value={settings.social_facebook}
                                    onChange={(e) => updateSetting('social_facebook', e.target.value)}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Instagram URL</Label>
                                <Input
                                    value={settings.social_instagram}
                                    onChange={(e) => updateSetting('social_instagram', e.target.value)}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>YouTube URL</Label>
                                <Input
                                    value={settings.social_youtube}
                                    onChange={(e) => updateSetting('social_youtube', e.target.value)}
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Testimonials Management */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Testimonials</CardTitle>
                            <CardDescription>Manage customer testimonials shown on homepage.</CardDescription>
                        </div>
                        <Button
                            size="sm"
                            onClick={() => setShowAddTestimonial(!showAddTestimonial)}
                            className="bg-[#2d5016] text-white hover:bg-[#2d5016]/90"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add Testimonial
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {/* Add New Testimonial Form */}
                        {showAddTestimonial && (
                            <div className="mb-6 p-4 border rounded-lg bg-muted/20 space-y-4">
                                <h4 className="font-medium">New Testimonial</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        placeholder="Customer Name"
                                        value={newTestimonial.name}
                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Role (e.g., Patient)"
                                        value={newTestimonial.role}
                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                                    />
                                </div>
                                <Textarea
                                    placeholder="Testimonial quote..."
                                    value={newTestimonial.quote}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                                    rows={2}
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleAddTestimonial}>
                                        <Check className="w-4 h-4 mr-2" /> Save
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => setShowAddTestimonial(false)}>
                                        <X className="w-4 h-4 mr-2" /> Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Testimonials List */}
                        <div className="space-y-4">
                            {testimonials.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No testimonials yet. Add one to get started.</p>
                            ) : (
                                testimonials.map((t) => (
                                    <div key={t.id} className="p-4 border rounded-lg">
                                        {editingTestimonial?.id === t.id ? (
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <Input
                                                        value={editingTestimonial.name}
                                                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                                                    />
                                                    <Input
                                                        value={editingTestimonial.role}
                                                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                                                    />
                                                </div>
                                                <Textarea
                                                    value={editingTestimonial.quote}
                                                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                                                    rows={2}
                                                />
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={handleUpdateTestimonial}>
                                                        <Check className="w-4 h-4 mr-2" /> Save
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => setEditingTestimonial(null)}>
                                                        <X className="w-4 h-4 mr-2" /> Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-medium">{t.name}</div>
                                                    <div className="text-sm text-muted-foreground">{t.role}</div>
                                                    <p className="mt-2 text-sm italic">"{t.quote}"</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8"
                                                        onClick={() => setEditingTestimonial(t)}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                                                        onClick={() => handleDeleteTestimonial(t.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
