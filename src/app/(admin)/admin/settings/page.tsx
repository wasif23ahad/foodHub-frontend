"use client";

import { useState } from "react";
import {
    Settings,
    Bell,
    Shield,
    Globe,
    Save,
    Mail,
    Smartphone,
    Building2,
    ShieldAlert,
    Palette
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ThemeSwitcher } from "@/components/dashboard/theme-switcher";
import { toast } from "sonner";

export default function AdminSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("System settings updated successfully");
        }, 1000);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-4xl font-black tracking-tight text-foreground">Admin Settings</h1>
                <p className="text-muted-foreground mt-1 font-medium italic">
                    Configure platform-wide parameters and security protocols.
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-16 p-1.5 bg-muted/50 rounded-[1.25rem] mb-10 border-2 border-border/50">
                    <TabsTrigger value="general" className="h-full gap-3 rounded-[0.9rem] font-bold text-sm transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 border border-transparent data-[state=active]:border-border/50">
                        <Settings className="h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="h-full gap-3 rounded-[0.9rem] font-bold text-sm transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 border border-transparent data-[state=active]:border-border/50">
                        <Bell className="h-4 w-4" />
                        System
                    </TabsTrigger>
                    <TabsTrigger value="security" className="h-full gap-3 rounded-[0.9rem] font-bold text-sm transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 border border-transparent data-[state=active]:border-border/50">
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="h-full gap-3 rounded-[0.9rem] font-bold text-sm transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 border border-transparent data-[state=active]:border-border/50">
                        <Palette className="h-4 w-4" />
                        Theme
                    </TabsTrigger>
                    <TabsTrigger value="localization" className="h-full gap-3 rounded-[0.9rem] font-bold text-sm transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 border border-transparent data-[state=active]:border-border/50">
                        <Globe className="h-4 w-4" />
                        Locale
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                    <Card className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Building2 className="h-6 w-6 text-primary" />
                                Platform Identity
                            </CardTitle>
                            <CardDescription>Core details for the FoodHub ecosystem.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="site-name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Platform Name</Label>
                                    <Input id="site-name" defaultValue="FoodHub" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact-email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">System Email</Label>
                                    <Input id="contact-email" defaultValue="admin@foodhub.com" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="site-description" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Site Meta Description</Label>
                                <Input id="site-description" defaultValue="Delicious Meals Delivered" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2 text-rose-500">
                                <ShieldAlert className="h-6 w-6" />
                                Emergency Controls
                            </CardTitle>
                            <CardDescription>Global flags for platform availability.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between p-6 bg-rose-500/5 rounded-3xl border-2 border-rose-500/10">
                            <div className="space-y-0.5">
                                <Label className="text-base font-bold">Maintenance Mode</Label>
                                <p className="text-sm text-muted-foreground">Only administrative users will be able to access the platform.</p>
                            </div>
                            <Switch />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Bell className="h-6 w-6 text-primary" />
                                System Notifications
                            </CardTitle>
                            <CardDescription>Configure global alert channels.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-0 p-0">
                            <div className="flex items-center justify-between p-8 border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-bold">New Provider Registration</Label>
                                        <p className="text-sm text-muted-foreground">Send email alerts when a new provider signs up.</p>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-8 border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                        <Smartphone className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label className="text-base font-bold">System Health Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Notify sys-admins about critical server errors.</p>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security */}
                <TabsContent value="security" className="space-y-6">
                    <Card className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Shield className="h-6 w-6 text-primary" />
                                Authentication Policy
                            </CardTitle>
                            <CardDescription>Strict security requirements for the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-6 rounded-3xl bg-muted/30 border-2 border-border/50">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Enforce 2FA</Label>
                                    <p className="text-sm text-muted-foreground">Require Two-Factor Authentication for all admin accounts.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="session-timeout" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Session Timeout (min)</Label>
                                    <Input id="session-timeout" type="number" defaultValue="60" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="failed-attempts" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Max Login Attempts</Label>
                                    <Input id="failed-attempts" type="number" defaultValue="5" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Appearance */}
                <TabsContent value="appearance" className="space-y-6">
                    <Card className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Palette className="h-6 w-6 text-primary" />
                                System Appearance
                            </CardTitle>
                            <CardDescription>Default theme preference for administrative users.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <ThemeSwitcher />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Localization */}
                <TabsContent value="localization" className="space-y-6">
                    <Card className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Globe className="h-6 w-6 text-primary" />
                                Regional Settings
                            </CardTitle>
                            <CardDescription>Default language and currency for the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="currency" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Platform Currency</Label>
                                <Input id="currency" defaultValue="BDT (৳)" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timezone" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Default Timezone</Label>
                                <Input id="timezone" defaultValue="Asia/Dhaka (UTC+6)" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4 pb-12">
                <Button
                    size="lg"
                    className="h-14 rounded-2xl px-12 gap-3 font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving Settings..." : "Save Platform Settings"}
                    {!isSaving && <Save className="h-5 w-5" />}
                </Button>
            </div>
        </div>
    );
}
