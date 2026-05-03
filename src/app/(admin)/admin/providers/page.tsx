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
    UserCheck,
    Filter,
    Star,
    Mail
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { ApiResponse, Provider } from "@/types";
import { toast } from "sonner";
import { getMediaUrl } from "@/lib/utils";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function AdminProvidersPage() {
    const [search, setSearch] = useState("");
    const [cuisineFilter, setCuisineFilter] = useState<string>("all");
    const [deleteTarget, setDeleteTarget] = useState<Provider | null>(null);
    const queryClient = useQueryClient();

    const { data: providersData, isLoading, error } = useQuery({
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
            label: "Active Kitchens",
            value: providersData?.filter(p => p.isActive).length || 0,
            color: "text-emerald-500",
            icon: TrendingUp
        },
        {
            label: "Platform Rating",
            value: providersData && providersData.length > 0
                ? (providersData.reduce((sum, p) => sum + (p.avgRating || 0), 0) / providersData.length).toFixed(1)
                : "N/A",
            color: "text-amber-500",
            icon: Star
        }
    ];

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <EmptyState
                    icon={Store}
                    title="Error loading providers"
                    description="We couldn't retrieve the provider directory. Please try again later."
                >
                    <Button onClick={() => window.location.reload()} className="mt-4 rounded-xl font-bold border-2" variant="outline">Refresh Page</Button>
                </EmptyState>
            </div>
        );
    }

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Provider Management</h1>
                    <p className="text-muted-foreground mt-1 font-medium italic">Monitor and manage all food providers on the platform.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="border-border bg-card rounded-[2rem] shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
                            <CardContent className="pt-8 pb-8 px-8 flex items-center justify-between">
                                <div>
                                    <div className={`text-4xl font-black ${stat.color} tabular-nums tracking-tighter`}>
                                        {stat.value}
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-2">{stat.label}</p>
                                </div>
                                <div className={`p-4 rounded-2xl ${stat.color} bg-current/10 group-hover:scale-110 transition-transform`}>
                                    <Icon className="h-7 w-7" />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search providers by name, email or cuisine..."
                        className="pl-12 h-14 bg-card border-2 border-border rounded-2xl focus:border-primary/20 focus:ring-primary/10 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                        <SelectTrigger className="h-14 w-full lg:w-56 rounded-2xl border-2 border-border bg-card px-4 py-2 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/10 outline-none hover:border-primary/50 transition-colors">
                            <SelectValue placeholder="All Cuisines" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-2 max-h-80">
                            <SelectItem value="all" className="font-bold rounded-xl">All Cuisines</SelectItem>
                            {cuisineTypes.map(cuisine => (
                                <SelectItem key={cuisine as string} value={cuisine as string} className="font-bold rounded-xl">{cuisine as string}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Providers Table */}
            <div className="rounded-[2.5rem] border-2 border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 border-b-2 border-border hover:bg-muted/30 transition-none">
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Business Profile</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Cuisine</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Location</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Rating</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 shrink-0 rounded-full bg-muted animate-pulse" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                                    <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><div className="h-8 w-24 bg-muted animate-pulse rounded-2xl" /></TableCell>
                                        <TableCell><div className="h-4 w-40 bg-muted animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded" /></TableCell>
                                        <TableCell><div className="h-8 w-20 bg-muted animate-pulse rounded-2xl" /></TableCell>
                                        <TableCell className="text-right px-8"><div className="h-10 w-10 ml-auto bg-muted animate-pulse rounded-xl" /></TableCell>
                                    </TableRow>
                                ))
                            ) : providers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-24 text-center">
                                        <EmptyState
                                            icon={Store}
                                            title="No providers found"
                                            description={search ? `No results matching "${search}".` : "There are currently no registered food providers."}
                                        />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                providers.map((provider) => (
                                    <TableRow key={provider.id} className="hover:bg-muted/30 transition-all group/row border-b border-border/50">
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 border-2 border-border shadow-sm shrink-0 transition-transform group-hover/row:scale-110">
                                                    <AvatarImage src={getMediaUrl(provider.logo)} alt={provider.businessName} className="object-cover" />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                                                        {provider.businessName.slice(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-foreground text-lg leading-tight group-hover/row:text-primary transition-colors">
                                                        {provider.businessName}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 mt-1 uppercase tracking-wider">
                                                        <Mail className="h-3 w-3 text-primary/60" /> {provider.contactEmail}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <Badge variant="outline" className="rounded-xl px-4 py-1.5 font-bold border-2 border-primary/20 bg-primary/5 text-primary">
                                                {provider.cuisineType || "General"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold italic">
                                                <MapPin className="h-4 w-4 opacity-40 shrink-0 text-primary" />
                                                <span className="truncate max-w-[150px]">{provider.address || "N/A"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            {(provider.avgRating && provider.avgRating > 0) ? (
                                                <div className="flex items-center gap-2 text-amber-500 font-black tabular-nums text-lg">
                                                    <Star className="h-4 w-4 fill-current" />
                                                    <span>{provider.avgRating.toFixed(1)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider opacity-40 italic">New Kitchen</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <StatusPill value={provider.isActive ? "active" : "inactive"} />
                                        </TableCell>
                                        <TableCell className="px-8 py-6 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                                                        <MoreHorizontal className="h-5 w-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-3 shadow-2xl border-2 border-border">
                                                    <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Partner Controls</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="my-2 bg-border/50" />
                                                    {provider.isActive ? (
                                                        <DropdownMenuItem
                                                            className="text-rose-500 focus:text-rose-500 focus:bg-rose-500/10 rounded-xl cursor-pointer font-black py-3 px-3"
                                                            onClick={() => updateProviderStatusMutation.mutate({ providerId: provider.id, isActive: false })}
                                                            disabled={updateProviderStatusMutation.isPending}
                                                        >
                                                            <UserMinus className="mr-3 h-4 w-4" /> Suspend Partner
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            className="text-emerald-500 focus:text-emerald-500 focus:bg-emerald-500/10 rounded-xl cursor-pointer font-black py-3 px-3"
                                                            onClick={() => updateProviderStatusMutation.mutate({ providerId: provider.id, isActive: true })}
                                                            disabled={updateProviderStatusMutation.isPending}
                                                        >
                                                            <UserCheck className="mr-3 h-4 w-4" /> Activate Partner
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        className="text-rose-600 focus:text-rose-600 focus:bg-rose-600/10 rounded-xl cursor-pointer font-black py-3 px-3 mt-1"
                                                        onClick={() => setDeleteTarget(provider)}
                                                    >
                                                        <Trash2 className="mr-3 h-4 w-4" /> Purge Partner
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
                <AlertDialogContent className="rounded-[2rem] border-2">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black text-foreground">Purge Partner Record?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium italic">
                            You are about to permanently delete <strong>{deleteTarget?.businessName}</strong>. This will erase all associated meals, orders, and branding assets.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel className="rounded-xl font-bold h-12 border-2">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="rounded-xl font-bold h-12 bg-rose-600 hover:bg-rose-700"
                            onClick={() => deleteTarget && deleteProviderMutation.mutate(deleteTarget.id)}
                        >
                            Confirm Purge
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
