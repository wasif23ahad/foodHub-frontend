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
    // Field names match what the backend expects:
    // phone (not contactPhone), logo (not coverImage)
    businessName: z.string().min(2, "Business name is required"),
    description: z.string().max(500).optional(),
    logo: z.string().optional(),
    phone: z.string().min(5, "Contact phone is required").max(20).optional(),
    contactEmail: z.string().email("Valid email is required").optional().or(z.literal("")),
    cuisineType: z.string().max(50).optional(),
    address: z.string().max(255).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProviderProfilePage() {
    const queryClient = useQueryClient();

    // Use throwOnError: false so a 404 (no profile yet) renders null profile,
    // not an unrecoverable error screen
    const { data: profile, isLoading } = useQuery({
        queryKey: ["provider-profile"],
        queryFn: async () => {
            try {
                // api.get returns res.json() directly = { success, data: profile|null }
                const body = await api.get<ApiResponse<ProviderProfile>>("/provider/profile");
                return body.data ?? null;
            } catch {
                // New provider — no profile exists yet. Return null to trigger create mode.
                return null;
            }
        },
        retry: false,
        staleTime: 30_000,
    });

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        values: {
            businessName: profile?.businessName || "",
            description: profile?.description || "",
            logo: profile?.logo || "",
            // phone field — backend stores as `phone`, not `contactPhone`
            phone: (profile as any)?.phone || (profile as any)?.contactPhone || "",
            contactEmail: profile?.contactEmail || "",
            cuisineType: (profile as any)?.cuisineType || "",
            address: (profile as any)?.address || "",
        },
    });

    const updateProfile = useMutation({
        mutationFn: async (values: ProfileFormValues) => {
            // Sanitize: remove empty strings so URL/email validators don't trip on ""
            const payload: Record<string, unknown> = {};
            if (values.businessName) payload.businessName = values.businessName;
            if (values.description) payload.description = values.description;
            if (values.logo) payload.logo = values.logo;
            if (values.phone) payload.phone = values.phone;
            if (values.contactEmail) payload.contactEmail = values.contactEmail;
            if (values.cuisineType) payload.cuisineType = values.cuisineType;
            if (values.address) payload.address = values.address;

            if (!profile) {
                // No existing profile — create it (POST)
                return api.post<ApiResponse<ProviderProfile>>("/provider/profile", payload);
            }
            // Profile exists — update it (PUT)
            return api.put<ApiResponse<ProviderProfile>>("/provider/profile", payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["provider-profile"] });
            toast.success("Profile saved successfully!");
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || "Failed to save profile";
            toast.error(message);
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
                        {profile
                            ? "Manage how your restaurant appears to customers on FoodHub."
                            : "Set up your business profile to start adding meals."}
                    </p>
                </div>
            </div>

            {!profile && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                    <strong>Welcome!</strong> Please complete your business profile before adding meals.
                </div>
            )}

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
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Phone</FormLabel>
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
                                        <FormItem>
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
                                    name="cuisineType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cuisine Type</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Italian, Deshi, Fast Food" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Restaurant Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. 123 Main St, Dhaka" {...field} />
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
                                                    aspectRatio="square"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                A square image works best for your logo.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <Button type="submit" disabled={updateProfile.isPending}>
                                    {updateProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {profile ? "Save Changes" : "Create Profile"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
