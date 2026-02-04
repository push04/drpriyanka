"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewServicePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [duration, setDuration] = useState("");
    const [status, setStatus] = useState("active");

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Upload Image if exists
            let imageUrl = null;
            if (imageFile) {
                setIsUploading(true);
                const fileName = `${Date.now()}-${imageFile.name}`;
                const { data, error } = await supabase.storage
                    .from('clinic-assets')
                    .upload(fileName, imageFile);

                if (error) throw error;

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('clinic-assets')
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
                setIsUploading(false);
            }

            // Insert Service Data
            const { error: insertError } = await supabase
                .from('services')
                .insert({
                    name,
                    category,
                    description,
                    price: parseFloat(price),
                    duration: `${duration} min`, // Standardizing format
                    status,
                    image: imageUrl,
                    tags: [] // Default empty tags for now
                });

            if (insertError) throw insertError;

            router.push("/admin/services");
            router.refresh();

        } catch (error: any) {
            console.error("Error creating service:", error);
            alert(error.message || "Failed to create service");
        } finally {
            setIsLoading(false);
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                    <Link href="/admin/services">
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back
                    </Link>
                </Button>
                <div>
                    <h2 className="text-3xl font-serif font-bold text-[#2d5016]">Add New Service</h2>
                    <p className="text-muted-foreground">Create a new offering for patients.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Service Details</CardTitle>
                        <CardDescription>Enter the information that will be displayed to patients.</CardDescription>
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
                                {imagePreview ? (
                                    <div className="relative h-48 w-full">
                                        <img src={imagePreview} alt="Preview" className="h-full w-full object-contain mx-auto" />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="absolute top-2 right-2"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setImagePreview(null);
                                                setImageFile(null);
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
                            <Button type="submit" disabled={isLoading} className="bg-[#2d5016] hover:bg-[#2d5016]/90">
                                {isLoading ? (isUploading ? "Uploading Image..." : "Creating...") : "Create Service"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
