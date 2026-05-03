"use client";

import { useState } from "react";
import { 
    User, 
    Bell, 
    Palette, 
    Lock, 
    Save, 
    Mail, 
    UserCircle,
    ShieldCheck,
    CreditCard
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
import { useAuth } from "@/components/providers/auth-provider";
import { toast } from "sonner";

export default function CustomerSettingsPage() {
    const { user } = useAuth();
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
                <h1 className="text-4xl font-black tracking-tight text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1 font-medium italic">
                    Manage your account preferences and application experience.
                </p>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-16 p-1.5 bg-muted/50 rounded-[1.25rem] mb-10 border-2 border-border/50">
                    <TabsTrigger value="account" className="h-full gap-3 rounded-[0.9rem] font-bold text-sm transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 border border-transparent data-[state=active]:border-border/50">
                        <User className="h-4 w-4" />
                        Account
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="h-full gap-3 rounded-[0.9rem] font-bold text-sm transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 border border-transparent data-[state=active]:border-border/50">
                        <Bell className="h-4 w-4" />
                        Alerts
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="h-full gap-3 rounded-[0.9rem] font-bold text-sm transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 border border-transparent data-[state=active]:border-border/50">
                        <Palette className="h-4 w-4" />
                        Theme
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="h-full gap-3 rounded-[0.9rem] font-bold text-sm transition-all data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/5 border border-transparent data-[state=active]:border-border/50">
                        <Lock className="h-4 w-4" />
                        Privacy
                    </TabsTrigger>
                </TabsList>

                {/* Account Settings */}
                <TabsContent value="account" className="space-y-6">
                    <Card className="border-border bg-card rounded-[2rem] overflow-hidden shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <UserCircle className="h-6 w-6 text-primary" />
                                Public Profile
                            </CardTitle>
                            <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</Label>
                                    <Input 
                                        id="name" 
                                        defaultValue={user?.name} 
                                        className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</Label>
                                    <Input 
                                        id="email" 
                                        defaultValue={user?.email} 
                                        className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio" className="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">Bio</Label>
                                <Input 
                                    id="bio" 
                                    placeholder="Tell us a bit about your food preferences..." 
                                    className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-card rounded-[2rem] overflow-hidden shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <CreditCard className="h-6 w-6 text-primary" />
                                Payment Methods
                            </CardTitle>
                            <CardDescription>Manage your saved cards and wallets.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-8 rounded-[1.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center text-center gap-3">
                                <div className="p-3 bg-muted rounded-full">
                                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-bold">No saved payment methods</p>
                                    <p className="text-sm text-muted-foreground">Add a card for faster checkout.</p>
                                </div>
                                <Button variant="outline" className="mt-2 rounded-xl font-bold border-2">Add New Card</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card className="border-border bg-card rounded-[2rem] overflow-hidden shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Bell className="h-6 w-6 text-primary" />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>Choose how you want to be notified.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-0">
                            <div className="flex items-center justify-between p-6 rounded-2xl hover:bg-muted/30 transition-colors border-b border-border/50">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive updates about your orders via email.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between p-6 rounded-2xl hover:bg-muted/30 transition-colors border-b border-border/50">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">SMS Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Get instant text alerts when your food is ready.</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between p-6 rounded-2xl hover:bg-muted/30 transition-colors">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Promotional Offers</Label>
                                    <p className="text-sm text-muted-foreground">Be the first to know about discounts and deals.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Appearance */}
                <TabsContent value="appearance" className="space-y-6">
                    <Card className="border-border bg-card rounded-[2rem] overflow-hidden shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <Palette className="h-6 w-6 text-primary" />
                                Interface Theme
                            </CardTitle>
                            <CardDescription>Personalize the look and feel of the application.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <ThemeSwitcher />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Privacy */}
                <TabsContent value="privacy" className="space-y-6">
                    <Card className="border-border bg-card rounded-[2rem] overflow-hidden shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                                Security & Privacy
                            </CardTitle>
                            <CardDescription>Protect your account and data.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-6 rounded-2xl bg-muted/30 border-2 border-border/50">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                                </div>
                                <Button variant="outline" className="rounded-xl font-bold border-2">Enable</Button>
                            </div>
                            
                            <div className="space-y-4 pt-4">
                                <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground ml-1">Session Management</h4>
                                <div className="p-6 rounded-2xl border-2 border-border flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Current Session</p>
                                            <p className="text-xs text-muted-foreground font-medium">Dhaka, Bangladesh • Active Now</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="rounded-lg font-bold">TRUSTED</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4">
                <Button
                    size="lg"
                    className="h-14 rounded-2xl px-10 gap-3 font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                    {!isSaving && <Save className="h-5 w-5" />}
                </Button>
            </div>
        </div>
    );
}

const Badge = ({ children, variant = "primary", className }: { children: React.ReactNode, variant?: "primary" | "secondary", className?: string }) => {
    return (
        <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-black rounded-lg ${
            variant === "primary" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
        } ${className}`}>
            {children}
        </span>
    );
};
