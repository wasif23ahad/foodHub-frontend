"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Mail, MapPin, User as UserIcon, Shield, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { EditProfileDialog } from "@/components/profile/edit-profile-dialog";
import { getMediaUrl } from "@/lib/utils";

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-32 w-32 bg-muted rounded-full"></div>
                    <div className="h-8 w-48 bg-muted rounded"></div>
                    <div className="h-4 w-64 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <div className="max-w-2xl mx-auto">
                    {/* User Info Card */}
                    <Card className="h-fit">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto mb-4 relative w-fit">
                                <EditProfileDialog
                                    trigger={
                                        <div className="relative group cursor-pointer">
                                            <Avatar className="h-32 w-32 border-4 border-primary/10 group-hover:opacity-80 transition-opacity">
                                                <AvatarImage src={getMediaUrl(user.image)} alt={user.name} />
                                                <AvatarFallback className="text-4xl font-bold bg-primary/10 text-primary">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                                                <span className="text-white text-xs font-medium">Edit</span>
                                            </div>
                                        </div>
                                    }
                                />
                                <Badge className="absolute bottom-0 right-0 bg-primary text-white text-sm px-3 py-1 rounded-full capitalize pointer-events-none translate-x-1/4">
                                    {user.role}
                                </Badge>
                            </div>
                            <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                            <div className="flex items-center justify-center gap-2 text-muted-foreground mt-2">
                                <Mail className="h-4 w-4" />
                                <span className="text-sm">{user.email}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    <span className="text-muted-foreground">Member since:</span>
                                    <span className="font-medium">
                                        {user.createdAt
                                            ? format(new Date(user.createdAt), "MMMM d, yyyy")
                                            : "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield className="h-4 w-4 text-primary" />
                                    <span className="text-muted-foreground">Account Status:</span>
                                    <span className="font-medium text-green-600">Active</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span className="text-muted-foreground">Address:</span>
                                    <span className="font-medium">{user.address || "Not set"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <UserIcon className="h-4 w-4 text-primary" />
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span className="font-medium">{user.phone || "Not set"}</span>
                                </div>
                            </div>

                            <EditProfileDialog />
                        </CardContent>
                    </Card>

                </div>
            </motion.div >
        </div >
    );
}
