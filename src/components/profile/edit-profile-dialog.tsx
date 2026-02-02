"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { getMediaUrl } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    image: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    address: z.string().max(200, "Address must be at most 200 characters").optional().or(z.literal("")),
    phone: z.string().max(20, "Phone number must be at most 20 characters").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function EditProfileDialog({ trigger }: { trigger?: React.ReactNode }) {
    const { user, refreshUser } = useAuth();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || "",
            image: user?.image || "",
            address: user?.address || "",
            phone: user?.phone || "",
        },
    });

    // Reset form when user data changes (e.g. after initial load or update)
    // This ensures inputs are populated with the latest DB data
    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name || "",
                image: user.image || "",
                address: user.address || "",
                phone: user.phone || "",
            });
        }
    }, [user, form]);

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true);
        try {
            await api.patch("/user/profile", data);
            await refreshUser(); // Refresh user data in auth context
            toast.success("Profile updated successfully");
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const toastId = toast.loading("Uploading image...");

        try {
            const res = await api.post<any>("/upload", formData);

            const imageUrl = res.data?.url;

            if (imageUrl) {
                form.setValue("image", imageUrl, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                });
                toast.success("Image uploaded successfully", { id: toastId });
            } else {
                console.error("No URL in response", res);
                toast.error("Upload succeeded but no URL returned", { id: toastId });
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image", { id: toastId });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="w-full" variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Image</FormLabel>
                                    <FormControl>
                                        <div className="space-y-2">
                                            {/* Hidden input to store the actual URL string */}
                                            <Input type="hidden" {...field} />

                                            {/* File input for uploading - NOT bound to the form field */}
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                placeholder="Upload your image"
                                                onChange={(e) => handleFileUpload(e)}
                                            />

                                            {/* Preview */}
                                            {field.value && (
                                                <div className="mt-2 flex items-center gap-4">
                                                    <Avatar className="h-16 w-16 border border-border">
                                                        <AvatarImage src={getMediaUrl(field.value)} />
                                                        <AvatarFallback>IMG</AvatarFallback>
                                                    </Avatar>
                                                    <p className="text-xs text-muted-foreground break-all max-w-[200px]">
                                                        {field.value.split("/").pop()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
