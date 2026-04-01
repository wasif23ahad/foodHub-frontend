"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, AlertCircle, Building, MapPin, Phone, Info } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const setupSchema = z.object({
    businessName: z.string().min(2, "Business name must be at least 2 characters").max(100, "Business name is too long"),
    description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description is too long").optional().or(z.literal("")),
    address: z.string().min(5, "Address must be at least 5 characters").max(200, "Address is too long").optional().or(z.literal("")),
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long").optional().or(z.literal("")),
    cuisineType: z.string().min(2, "Cuisine type is required").max(50).optional().or(z.literal("")),
});

type SetupFormValues = z.infer<typeof setupSchema>;

export default function ProviderSetupPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SetupFormValues>({
        resolver: zodResolver(setupSchema),
        defaultValues: {
            businessName: "",
            description: "",
            address: "",
            phone: "",
            cuisineType: "",
        },
    });

    async function onSubmit(data: SetupFormValues) {
        setIsSubmitting(true);
        try {
            await api.put(`/provider/profile`, data);
            toast.success("Profile created successfully!");
            // Force reload to update auth context
            window.location.href = "/provider/dashboard";
        } catch (error: any) {
            toast.error(error.message || "Failed to finalize profile setup.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to FoodHub</h1>
                    <p className="text-muted-foreground mt-2">
                        Let's set up your kitchen profile to start selling meals.
                    </p>
                </div>

                <div className="mb-8 border border-primary/20 bg-primary/5 rounded-lg p-4 flex gap-3 text-sm">
                    <Info className="h-5 w-5 text-primary shrink-0" />
                    <div>
                        <h5 className="text-primary font-semibold mb-1">One Last Step</h5>
                        <p className="text-muted-foreground">
                            Before you can access your dashboard and start creating meals, we need a few details about your business.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Business Information</CardTitle>
                        <CardDescription>
                            This information will be displayed to customers when they view your meals.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="businessName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Building className="w-4 h-4 text-muted-foreground" />
                                                Business Name <span className="text-destructive">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Mama's Kitchen" {...field} />
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
                                            <FormLabel className="flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                                                Brief Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea 
                                                    placeholder="Tell customers what makes your food special..." 
                                                    {...field}
                                                    className="resize-none"
                                                    rows={3} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                                    Kitchen Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123 Food Street" {...field} />
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
                                                <FormLabel className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                                    Contact Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+8801XXXXXXXXX" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="cuisineType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cuisine Specialty</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Bengali, Italian, Fast Food" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="pt-4 flex justify-end">
                                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                                        {isSubmitting ? "Setting up..." : "Complete Setup"}
                                        {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
