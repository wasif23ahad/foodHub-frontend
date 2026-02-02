"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Store,
    Search,
    MapPin,
    Users,
    TrendingUp,
    Eye
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { ApiResponse, Provider } from "@/types";
import Link from "next/link";
import { getMediaUrl } from "@/lib/utils";

export default function AdminProvidersPage() {
    const [search, setSearch] = useState("");
    const [cuisineFilter, setCuisineFilter] = useState<string>("all");

    const { data: providersData, isLoading } = useQuery({
        queryKey: ["admin-providers"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Provider[]>>("/providers");
                return res.data;
            } catch (err) {
                console.error("Providers fetch failed", err);
                return [];
            }
        }
    });

    const providers = (providersData || []).filter(provider =>
        (search === "" ||
            provider.businessName.toLowerCase().includes(search.toLowerCase()) ||
            provider.contactEmail?.toLowerCase().includes(search.toLowerCase())) &&
        (cuisineFilter === "all" || provider.cuisineType === cuisineFilter)
    );

    const cuisineTypes = [...new Set((providersData || []).map(p => p.cuisineType).filter(Boolean))];

    const stats = [
        {
            label: "Total Providers",
            value: providersData?.length || 0,
            color: "text-blue-600",
            icon: Store
        },
        {
            label: "Active",
            value: providersData?.filter(p => p.isActive).length || 0,
            color: "text-green-600",
            icon: TrendingUp
        },
        {
            label: "Total Rating",
            value: providersData && providersData.length > 0 
                ? (providersData.reduce((sum, p) => sum + (p.rating || 0), 0) / providersData.length).toFixed(1)
                : "0.0",
            color: "text-yellow-600",
            icon: Users
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Provider Management</h1>
                <p className="text-muted-foreground mt-1">Monitor and manage all food providers on the platform.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="border-none shadow-md">
                            <CardContent className="pt-6 flex items-center justify-between">
                                <div>
                                    <div className={`text-3xl font-bold ${stat.color}`}>
                                        {stat.value}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
                                </div>
                                <Icon className={`h-10 w-10 ${stat.color} opacity-20`} />
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters */}
            <Card className="shadow-sm border-muted">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-2 block">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="pl-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="md:w-48">
                            <label className="text-sm font-medium mb-2 block">Cuisine Type</label>
                            <select
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                                value={cuisineFilter}
                                onChange={(e) => setCuisineFilter(e.target.value)}
                            >
                                <option value="all">All Cuisines</option>
                                {cuisineTypes.map(cuisine => (
                                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Providers Table */}
            <Card className="shadow-sm border-muted overflow-hidden">
                <CardHeader className="pb-4">
                    <CardTitle>Registered Providers</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    ) : providers.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No providers found matching your filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Provider</TableHead>
                                        <TableHead>Cuisine</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {providers.map((provider) => (
                                        <TableRow key={provider.id} className="hover:bg-muted/30">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={getMediaUrl(provider.logo)} alt={provider.businessName} />
                                                        <AvatarFallback className="bg-primary/10 text-xs">
                                                            {provider.businessName.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">{provider.businessName}</span>
                                                        <span className="text-xs text-muted-foreground">{provider.contactEmail}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-xs">
                                                    {provider.cuisineType || "General"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {provider.address || "N/A"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-yellow-100 text-yellow-800 border-none">
                                                    ⭐ {(provider.rating || 4.5).toFixed(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={provider.isActive ? "bg-green-100 text-green-800 border-none" : "bg-gray-100 text-gray-800 border-none"}>
                                                    {provider.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/admin/providers/${provider.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
