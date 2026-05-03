"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { api, API_URL } from "@/lib/api";
import { getMediaUrl, cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    aspectRatio?: "square" | "wide";
}

export function ImageUpload({ value, onChange, onRemove, aspectRatio = "wide" }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size should be less than 5MB");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            // Using the global fetch since our api helper expects JSON by default
            const res = await fetch(`${API_URL}/upload`, {
                method: "POST",
                body: formData,
                // Add Authorization header if needed, assuming cookies are handled by browser
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || "Upload failed");
            }

            const data = await res.json();
            
            if (data.success && data.data?.url) {
                onChange(data.data.url);
                toast.success("Image uploaded successfully");
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    return (
        <div className="w-full">
            {value ? (
                <div className={cn(
                    "relative rounded-xl overflow-hidden border border-border bg-muted/30 group flex items-center justify-center transition-all duration-300",
                    aspectRatio === "square" ? "w-48 h-48 mx-auto" : "w-full aspect-video min-h-[200px]"
                )}>
                    <Image
                        src={getMediaUrl(value)}
                        alt=""
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                        onError={() => {
                            toast.error("Failed to load current image");
                        }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                            disabled={isUploading}
                        >
                            Change
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                onChange("");
                                if (onRemove) onRemove();
                            }}
                            disabled={isUploading}
                        >
                            Remove
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => !isUploading && inputRef.current?.click()}
                    className={cn(
                        "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:bg-muted/50 hover:border-primary/50",
                        isUploading ? "opacity-50 cursor-not-allowed" : "",
                        aspectRatio === "square" ? "w-48 h-48 mx-auto" : "w-full min-h-[200px]"
                    )}
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <UploadCloud className="h-8 w-8 text-muted-foreground" />
                            <div className="text-center">
                                <p className="text-sm font-medium">Click to upload image</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    JPEG, PNG, WEBP (Max 5MB)
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                disabled={isUploading}
            />
        </div>
    );
}
