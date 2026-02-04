"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditServicePage() {
    const router = useRouter();
    const params = useParams();
    const serviceId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [status, setStatus] = useState("active");
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Fetch existing service data
    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await fetch('/api/admin/services');
                const data = await response.json();

                if (data.services) {
                    const service = data.services.find((s: any) => s.id === serviceId);
                    if (service) {
                        setName(service.name || "");
                        setCategory(service.category || "");
                        setDescription(service.description || "");
                        setPrice(service.price?.toString() || "");
                        // Extract numeric duration from string like "60 min"
                        const durationMatch = service.duration?.match(/(\d+)/);
                        setDuration(durationMatch ? durationMatch[1] : "");
                        setStatus(service.status || "active");
                        setCurrentImage(service.image || null);
                    }
                }
            } catch (error) {
                console.error("Error fetching service:", error);
            }
            setIsLoading(false);
        };
        fetchService();
    }, [serviceId]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Upload new image if selected
            let imageUrl = currentImage;
            if (imageFile) {
                setIsUploading(true);
                const fileName = `${Date.now()}-${imageFile.name}`;
                const { data, error } = await supabase.storage
                    .from('clinic-assets')
                    .upload(fileName, imageFile);

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage
                    .from('clinic-assets')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
                setIsUploading(false);
            }

            // Update service via API
            const response = await fetch('/api/admin/services', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: serviceId,
                    name,
                    category,
                    description,
                    price: parseFloat(price),
                    duration: `${duration} min`,
                    status,
                    image: imageUrl,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update service');
            }

            router.push("/admin/services");
            router.refresh();

        } catch (error: any) {
            console.error("Error updating service:", error);
            alert(error.message || "Failed to update service");
        } finally {
            setIsSaving(false);
            setIsUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/admin/services">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Edit Service</h2>
                    <p className="text-muted-foreground">Update service information.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Service Details</CardTitle>
                        <CardDescription>Modify the information displayed to patients.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Service Name</Label>
                                <Input
                                    placeholder="e.g. Traditional Massage"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="naturopathy">Naturopathy</SelectItem>
                                        <SelectItem value="yoga">Yoga Therapy</SelectItem>
                                        <SelectItem value="consultation">Consultation</SelectItem>
                                        <SelectItem value="ayurveda">Ayurveda</SelectItem>
                                        <SelectItem value="hydrotherapy">Hydrotherapy</SelectItem>
                                        <SelectItem value="massage">Massage</SelectItem>
                                        <SelectItem value="diet">Diet & Nutrition</SelectItem>
                                        <SelectItem value="Yoga & Meditation">Yoga & Meditation</SelectItem>
                                        <SelectItem value="Therapy">Therapy</SelectItem>
                                        <SelectItem value="Diet & Nutrition">Diet & Nutrition</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Describe the benefits and process of this therapy..."
                                className="min-h-[120px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label>Price (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="1500"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Duration (Minutes)</Label>
                                <Input
                                    type="number"
                                    placeholder="60"
                                    required
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Cover Image</Label>
                            <div className="border-2 border-dashed border-input hover:bg-muted/5 rounded-lg p-6 text-center transition-colors relative">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                                {imagePreview || currentImage ? (
                                    <div className="relative h-48 w-full">
                                        <img
                                            src={imagePreview || currentImage || ""}
                                            alt="Preview"
                                            className="h-full w-full object-contain mx-auto"
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setImagePreview(null);
                                                setImageFile(null);
                                                setCurrentImage(null);
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="py-8">
                                        <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
                                        <div className="text-sm font-medium">Click to upload or drag and drop</div>
                                        <div className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 5MB)</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isSaving} className="bg-[#2d5016] hover:bg-[#2d5016]/90">
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {isUploading ? "Uploading Image..." : "Saving..."}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
