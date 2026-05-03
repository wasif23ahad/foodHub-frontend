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
import { StatusPill } from "@/components/dashboard/badges";
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
            color: "text-blue-500",
            icon: Store
        },
        {
            label: "Active",
            value: providersData?.filter(p => p.isActive).length || 0,
            color: "text-emerald-500",
            icon: TrendingUp
        },
        {
            label: "Avg Rating",
            value: providersData && providersData.length > 0
                ? (providersData.reduce((sum, p) => sum + (p.avgRating || 0), 0) / providersData.length).toFixed(1)
                : "N/A",
            color: "text-amber-500",
            icon: Store
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Provider Management</h1>
                <p className="text-muted-foreground mt-1 font-medium italic">Monitor and manage all food providers on the platform.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="border-border bg-card shadow-sm">
                            <CardContent className="pt-6 flex items-center justify-between">
                                <div>
                                    <div className={`text-3xl font-bold ${stat.color} tabular-nums`}>
                                        {stat.value}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.color} bg-current/10`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="bg-card p-5 rounded-xl border border-border shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Search Providers</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-10 bg-background/50 border-border focus-visible:ring-primary/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="md:w-64">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Cuisine Type</label>
                        <select
                            className="w-full h-10 px-3 py-2 border border-border rounded-md bg-background/50 text-foreground text-sm focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer"
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
            </div>

            {/* Providers Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50 border-b border-border hover:bg-muted/50 transition-none">
                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Provider</TableHead>
                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cuisine</TableHead>
                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</TableHead>
                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</TableHead>
                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</TableHead>
                                <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6} className="p-0">
                                            <Skeleton className="h-16 w-full rounded-none" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : providers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Store className="h-12 w-12 mb-2 opacity-20" />
                                            <p>No providers found matching your filters.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                providers.map((provider) => (
                                    <TableRow key={provider.id} className="hover:bg-muted/30 transition-colors group">
                                        <TableCell className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-border shadow-sm shrink-0">
                                                    <AvatarImage src={getMediaUrl(provider.logo)} alt={provider.businessName} className="object-cover" />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                                        {provider.businessName.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                                                        {provider.businessName}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-bold">
                                                        {provider.contactEmail}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-4">
                                            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground border border-border/50">
                                                {provider.cuisineType || "General"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                <MapPin className="h-3.5 w-3.5 opacity-50 shrink-0" />
                                                <span className="truncate max-w-[150px]">{provider.address || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-4 py-4">
                                            {(provider.avgRating && provider.avgRating > 0) ? (
                                                <div className="flex items-center gap-1 text-amber-500 font-bold tabular-nums">
                                                    <span className="text-xs">⭐</span>
                                                    <span>{provider.avgRating.toFixed(1)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">No reviews</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-4">
                                            <StatusPill value={provider.isActive ? "active" : "inactive"} />
                                        </TableCell>
                                        <TableCell className="px-4 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted/80">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52 rounded-xl p-2 shadow-xl">
                                                    <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Provider Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="my-1" />
                                                    {provider.isActive ? (
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer font-medium"
                                                            onClick={() => updateProviderStatusMutation.mutate({ providerId: provider.id, isActive: false })}
                                                        >
                                                            <UserMinus className="mr-2 h-4 w-4" /> Suspend Business
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            className="text-emerald-500 focus:text-emerald-500 focus:bg-emerald-500/10 rounded-lg cursor-pointer font-medium"
                                                            onClick={() => updateProviderStatusMutation.mutate({ providerId: provider.id, isActive: true })}
                                                        >
                                                            <UserCheck className="mr-2 h-4 w-4" /> Activate Business
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer font-medium"
                                                        onClick={() => setDeleteTarget(provider)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Permanent Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Provider</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{deleteTarget?.businessName}</strong>?
                            This will permanently remove their profile and all associated meals.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => deleteTarget && deleteProviderMutation.mutate(deleteTarget.id)}
                            className="rounded-xl"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
