"use client";

export const dynamic = "force-dynamic";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ProviderProfile, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";

const profileSchema = z.object({
    businessName: z.string().min(2, "Business name is required"),
    description: z.string().max(1000).optional(),
    logo: z.string().optional(),
    coverImage: z.string().optional(),
    contactPhone: z.string().min(5, "Contact phone is required").max(20),
    contactEmail: z.string().email("Valid email is required").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProviderProfilePage() {
    const queryClient = useQueryClient();

    const { data: profile, isLoading } = useQuery({
        queryKey: ["provider-profile"],
        queryFn: async () => {
            const res = await api.get<ApiResponse<ProviderProfile>>("/provider/profile");
            return res.data;
        },
    });

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        values: {
            businessName: profile?.businessName || "",
            description: profile?.description || "",
            logo: profile?.logo || "",
            coverImage: profile?.coverImage || "",
            contactPhone: profile?.contactPhone || (profile as any)?.phone || "",
            contactEmail: profile?.contactEmail || "",
        },
    });

    const updateProfile = useMutation({
        mutationFn: async (values: ProfileFormValues) => {
            if (!profile) {
                // If the backend requires creating profile if not exists
                return api.post<ApiResponse<ProviderProfile>>("/provider/profile", values);
            }
            return api.put<ApiResponse<ProviderProfile>>("/provider/profile", values);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["provider-profile"] });
            toast.success("Profile updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update profile");
        },
    });

    function onSubmit(values: ProfileFormValues) {
        updateProfile.mutate(values);
    }

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-8">
            <div className="flex items-center gap-3">
                <Store className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Business Profile</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage how your restaurant appears to customers on FoodHub.
                    </p>
                </div>
            </div>

            <Card className="shadow-sm border-muted">
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>
                        These details will be shown on your public restaurant page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="businessName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Business Name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Bella Italia" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contactPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Phone *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. +880 1234 567890" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contactEmail"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Support Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="support@restaurant.com" type="email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>About Your Restaurant</FormLabel>
                                            <FormControl>
                                                <Textarea 
                                                    placeholder="Tell customers about your story and food..." 
                                                    className="resize-none h-24"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Branding</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FormField
                                        control={form.control}
                                        name="logo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Restaurant Logo</FormLabel>
                                                <FormControl>
                                                    <ImageUpload
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        onRemove={() => form.setValue("logo", "", { shouldValidate: true })}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    A square image works best for your logo.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="coverImage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cover Image</FormLabel>
                                                <FormControl>
                                                    <ImageUpload
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        onRemove={() => form.setValue("coverImage", "", { shouldValidate: true })}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    This will appear at the top of your restaurant page.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <Button type="submit" disabled={updateProfile.isPending}>
                                    {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
