"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Store,
    Search,
    MapPin,
    TrendingUp,
    MoreHorizontal,
    Trash2,
    UserMinus,
    UserCheck
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { toast } from "sonner";
import { getMediaUrl } from "@/lib/utils";

export default function AdminProvidersPage() {
    const [search, setSearch] = useState("");
    const [cuisineFilter, setCuisineFilter] = useState<string>("all");
    const [deleteTarget, setDeleteTarget] = useState<Provider | null>(null);
    const queryClient = useQueryClient();

    const { data: providersData, isLoading } = useQuery({
        queryKey: ["admin-providers"],
        queryFn: async () => {
            try {
                const body = await api.get<ApiResponse<Provider[]>>("/admin/providers?limit=100");
                return body.data ?? [];
            } catch (err) {
                console.error("Providers fetch failed", err);
                return [];
            }
        }
    });

    const deleteProviderMutation = useMutation({
        mutationFn: async (providerId: string) => {
            return api.delete<ApiResponse<{ message: string }>>(`/admin/providers/${providerId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
            toast.success("Provider deleted successfully");
            setDeleteTarget(null);
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to delete provider");
        }
    });

    const updateProviderStatusMutation = useMutation({
        mutationFn: async ({ providerId, isActive }: { providerId: string; isActive: boolean }) => {
            return api.patch<ApiResponse<Provider>>(`/admin/providers/${providerId}/status`, { isActive });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-providers"] });
            toast.success(variables.isActive ? "Provider activated successfully" : "Provider suspended successfully");
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to update provider status");
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
            label: "Avg Rating",
            value: providersData && providersData.length > 0
                ? (providersData.reduce((sum, p) => sum + (p.avgRating || 0), 0) / providersData.length).toFixed(1)
                : "N/A",
            color: "text-yellow-600",
            icon: Store
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
                                        <TableHead className="text-right">Actions</TableHead>
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
                                                {(provider.avgRating && provider.avgRating > 0) ? (
                                                    <Badge className="bg-yellow-100 text-yellow-800 border-none">
                                                        ⭐ {provider.avgRating.toFixed(1)}
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-gray-100 text-gray-500 border-none text-xs">
                                                        No reviews
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={provider.isActive ? "bg-green-100 text-green-800 border-none" : "bg-gray-100 text-gray-800 border-none"}>
                                                    {provider.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        {provider.isActive ? (
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                                onClick={() => updateProviderStatusMutation.mutate({ providerId: provider.id, isActive: false })}
                                                            >
                                                                <UserMinus className="mr-2 h-4 w-4" /> Suspend Provider
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                className="text-green-600 focus:text-green-600 focus:bg-green-50 cursor-pointer"
                                                                onClick={() => updateProviderStatusMutation.mutate({ providerId: provider.id, isActive: true })}
                                                            >
                                                                <UserCheck className="mr-2 h-4 w-4" /> Activate Provider
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                            onClick={() => setDeleteTarget(provider)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete Provider
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Provider</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{deleteTarget?.businessName}</strong>?
                            This will permanently remove their profile and all associated meals.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => deleteTarget && deleteProviderMutation.mutate(deleteTarget.id)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
