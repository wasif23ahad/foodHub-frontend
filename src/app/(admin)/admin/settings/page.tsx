"use client";

import { useState } from "react";
import {
    Settings,
    Bell,
    Shield,
    Globe,
    Save,
    CreditCard,
    Mail,
    Smartphone
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function AdminSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Settings updated successfully");
        }, 1000);
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage system-wide configurations and platform preferences.
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                    <TabsTrigger value="general" className="gap-2">
                        <Settings className="h-4 w-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="localization" className="gap-2">
                        <Globe className="h-4 w-4" />
                        Localization
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general">
                    <div className="grid gap-6">
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle>Platform Identity</CardTitle>
                                <CardDescription>Basic information about your platform.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="site-name">Platform Name</Label>
                                    <Input id="site-name" defaultValue="FoodHub" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="site-description">Site Description</Label>
                                    <Input id="site-description" defaultValue="Delicious Meals Delivered" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="contact-email">System Email</Label>
                                    <Input id="contact-email" defaultValue="admin@foodhub.com" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle>Maintenance Mode</CardTitle>
                                <CardDescription>Take the platform offline for maintenance.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Enable Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">Only admins will be able to access the site.</p>
                                </div>
                                <Switch />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Global Notifications</CardTitle>
                            <CardDescription>Configure how the system sends alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label>Email Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Send email for new provider registrations.</p>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                        <Smartphone className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <Label>Push Notifications</Label>
                                        <p className="text-sm text-muted-foreground">Send push alerts for critical system errors.</p>
                                    </div>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security */}
                <TabsContent value="security">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Authentication Settings</CardTitle>
                            <CardDescription>Policy configurations for user access.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Account Lockout</Label>
                                    <p className="text-sm text-muted-foreground">Lock accounts after 5 failed login attempts.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="grid gap-2 pt-2">
                                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                                <Input id="session-timeout" type="number" defaultValue="60" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Localization */}
                <TabsContent value="localization">
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle>Regional Settings</CardTitle>
                            <CardDescription>Default language and currency for the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="currency">Platform Currency</Label>
                                <Input id="currency" defaultValue="BDT (৳)" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="timezone">Default Timezone</Label>
                                <Input id="timezone" defaultValue="Asia/Dhaka (UTC+6)" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4">
                <Button
                    size="lg"
                    className="gap-2 px-8"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Settings"}
                    {!isSaving && <Save className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    );
}
