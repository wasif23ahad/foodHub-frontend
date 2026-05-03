"use client";

export const dynamic = "force-dynamic";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Store, Save, Building2, Info, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { ProviderProfile, ApiResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
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

    const { data: profile, isLoading } = useQuery({
        queryKey: ["provider-profile"],
        queryFn: async () => {
            try {
                const body = await api.get<ApiResponse<ProviderProfile>>("/provider/profile");
                return body.data ?? null;
            } catch {
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
            phone: (profile as any)?.phone || (profile as any)?.contactPhone || "",
            contactEmail: profile?.contactEmail || "",
            cuisineType: (profile as any)?.cuisineType || "",
            address: (profile as any)?.address || "",
        },
    });

    const updateProfile = useMutation({
        mutationFn: async (values: ProfileFormValues) => {
            const payload: Record<string, unknown> = {};
            if (values.businessName) payload.businessName = values.businessName;
            if (values.description) payload.description = values.description;
            if (values.logo) payload.logo = values.logo;
            if (values.phone) payload.phone = values.phone;
            if (values.contactEmail) payload.contactEmail = values.contactEmail;
            if (values.cuisineType) payload.cuisineType = values.cuisineType;
            if (values.address) payload.address = values.address;

            if (!profile) {
                return api.post<ApiResponse<ProviderProfile>>("/provider/profile", payload);
            }
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
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <Store className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground">Business Profile</h1>
                        <p className="text-muted-foreground mt-1 font-medium italic">
                            Manage how your restaurant appears on the platform.
                        </p>
                    </div>
                </div>
            </div>

            {!profile && (
                <div className="flex items-center gap-4 p-6 rounded-[2rem] bg-amber-500/10 border-2 border-amber-500/20 text-amber-700 dark:text-amber-400">
                    <div className="p-2 bg-amber-500 rounded-xl text-white">
                        <Info className="h-5 w-5" />
                    </div>
                    <p className="font-bold">Welcome! Please complete your business profile before adding meals.</p>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Branding Section */}
                        <Card className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden h-fit">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 text-primary" />
                                    Branding
                                </CardTitle>
                                <CardDescription>Your visual identity.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="logo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <ImageUpload
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onRemove={() => form.setValue("logo", "", { shouldValidate: true })}
                                                    aspectRatio="square"
                                                />
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground mt-3 font-medium text-center">
                                                A high-quality logo helps you stand out.
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        {/* Details Section */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-primary" />
                                        Business Details
                                    </CardTitle>
                                    <CardDescription>Basic information about your kitchen.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="businessName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Business Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Bella Italia" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" {...field} />
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
                                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Contact Phone</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="+880 1XXX XXXXXX" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="contactEmail"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Support Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="support@kitchen.com" type="email" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" {...field} />
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
                                                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Cuisine Type</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Italian, Fast Food" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Physical Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. 123 Main St, Dhaka" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">About Your Story</FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="Share your passion for food with your customers..." 
                                                        className="min-h-[120px] rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium resize-none"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <div className="flex justify-end pt-4 pb-12">
                                <Button 
                                    type="submit" 
                                    size="lg" 
                                    className="h-14 rounded-2xl px-12 gap-3 font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                    disabled={updateProfile.isPending}
                                >
                                    {updateProfile.isPending ? "Saving Profile..." : "Save Business Profile"}
                                    {!updateProfile.isPending && <Save className="h-5 w-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
