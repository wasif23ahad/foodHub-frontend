"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Search,
    MoreHorizontal,
    User as UserIcon,
    UserMinus,
    UserCheck,
    Trash2,
    Mail,
    Calendar,
    Filter,
    ChevronDown
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { User, ApiResponse } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { getMediaUrl } from "@/lib/utils";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [page, setPage] = useState(1);
    const limit = 10;
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [viewTarget, setViewTarget] = useState<User | null>(null);
    const queryClient = useQueryClient();

    // Debounce search so we don't spam the API
    const [debouncedSearch, setDebouncedSearch] = useState("");
    
    // Custom debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: responseData, isLoading, error } = useQuery({
        queryKey: ["admin-users", debouncedSearch, roleFilter, page],
        queryFn: async () => {
            try {
                const params = new URLSearchParams();
                if (debouncedSearch) params.append("search", debouncedSearch);
                if (roleFilter !== "all") params.append("role", roleFilter.toUpperCase());
                params.append("page", page.toString());
                params.append("limit", limit.toString());

                const res = await api.get<ApiResponse<User[]>>(`/admin/users?${params.toString()}`);
                return res; // Return the full response to get meta
            } catch (err) {
                console.error("Failed to fetch users:", err);
                throw err;
            }
        }
    });

    const usersData = responseData?.data || [];
    const meta = responseData?.meta;
    const totalPages = meta?.totalPages || 1;
    const totalUsers = meta?.total || 0;

    const banUserMutation = useMutation({
        mutationFn: async ({ userId, banned, banReason }: { userId: string; banned: boolean; banReason?: string }) => {
            return api.patch<ApiResponse<User>>(`/admin/users/${userId}/ban`, {
                banned,
                banReason: banReason || undefined
            });
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success(variables.banned ? "User banned successfully" : "User unbanned successfully");
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to update user status");
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (userId: string) => {
            return api.delete<ApiResponse<any>>(`/admin/users/${userId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("User deleted successfully");
            setDeleteTarget(null);
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to delete user");
        }
    });

    const filteredUsers = usersData; // Filtering is now server-side

    const getRoleBadge = (role: string) => {
        const roleLower = role.toLowerCase();
        switch (roleLower) {
            case "admin":
                return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20 transition-colors font-bold px-3">Admin</Badge>;
            case "provider":
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20 transition-colors font-bold px-3">Provider</Badge>;
            default:
                return <Badge className="bg-muted text-muted-foreground border-border hover:bg-muted/80 transition-colors font-bold px-3">Customer</Badge>;
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <EmptyState
                    icon={UserIcon}
                    title="Error loading users"
                    description="There was a problem communicating with the server. Please check your connection and try again."
                >
                    <Button onClick={() => window.location.reload()} className="mt-4 rounded-xl font-bold border-2" variant="outline">Try Again</Button>
                </EmptyState>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">User Management</h1>
                    <p className="text-muted-foreground mt-1 font-medium italic">Manage and monitor all registered accounts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="h-10 px-6 rounded-2xl font-black border-2 text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px]">
                        Total: {totalUsers}
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search users by name or email..."
                        className="pl-12 h-14 bg-card border-2 border-border rounded-2xl focus:border-primary/20 focus:ring-primary/10 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="h-14 w-full lg:w-48 rounded-2xl border-2 border-border bg-card px-4 py-2 text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/10 outline-none hover:border-primary/50 transition-colors">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-2">
                            <SelectItem value="all" className="font-bold rounded-xl">All Roles</SelectItem>
                            <SelectItem value="customer" className="font-bold rounded-xl">Customer</SelectItem>
                            <SelectItem value="provider" className="font-bold rounded-xl">Provider</SelectItem>
                            <SelectItem value="admin" className="font-bold rounded-xl">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Users Table */}
            <div className="rounded-[2.5rem] border-2 border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 border-b-2 border-border hover:bg-muted/30 transition-none">
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-[350px]">User Profile</TableHead>
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Account Role</TableHead>
                            <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Joined Date</TableHead>
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
                                    <TableCell><div className="h-4 w-28 bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell><div className="h-8 w-20 bg-muted animate-pulse rounded-2xl" /></TableCell>
                                    <TableCell className="text-right px-8"><div className="h-10 w-10 ml-auto bg-muted animate-pulse rounded-xl" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="py-24 text-center">
                                    <EmptyState
                                        icon={UserIcon}
                                        title="No users found"
                                        description={search ? `No results matching "${search}" for role "${roleFilter}".` : "The user directory is currently empty."}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/30 transition-all group/row border-b border-border/50">
                                    <TableCell className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border-2 border-border shadow-sm shrink-0 transition-transform group-hover/row:scale-110">
                                                <AvatarImage src={getMediaUrl(user.image)} alt={user.name} className="object-cover" />
                                                <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                                                    {user.name.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-black text-foreground text-lg leading-tight group-hover/row:text-primary transition-colors">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground font-bold flex items-center gap-1.5 mt-1">
                                                    <Mail className="h-3 w-3 text-primary/60" /> {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        {getRoleBadge(user.role)}
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-sm text-muted-foreground font-bold">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 opacity-40" />
                                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        <StatusPill value={user.banned ? "banned" : "active"} />
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-3 shadow-2xl border-2 border-border">
                                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Account Management</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    className="rounded-xl cursor-pointer py-3 px-3 font-bold"
                                                    onClick={() => setViewTarget(user)}
                                                >
                                                    <UserIcon className="mr-3 h-4 w-4 text-primary" /> View Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2 bg-border/50" />
                                                {!user.banned ? (
                                                    <DropdownMenuItem
                                                        className="text-rose-500 focus:text-rose-500 focus:bg-rose-500/10 rounded-xl cursor-pointer font-black py-3 px-3"
                                                        onClick={() => banUserMutation.mutate({ userId: user.id, banned: true })}
                                                        disabled={banUserMutation.isPending}
                                                    >
                                                        <UserMinus className="mr-3 h-4 w-4" /> Suspend Access
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        className="text-emerald-500 focus:text-emerald-500 focus:bg-emerald-500/10 rounded-xl cursor-pointer font-black py-3 px-3"
                                                        onClick={() => banUserMutation.mutate({ userId: user.id, banned: false })}
                                                        disabled={banUserMutation.isPending}
                                                    >
                                                        <UserCheck className="mr-3 h-4 w-4" /> Restore Access
                                                    </DropdownMenuItem>
                                                )}
                                                {user.role.toUpperCase() !== "ADMIN" && (
                                                    <DropdownMenuItem
                                                        className="text-rose-600 focus:text-rose-600 focus:bg-rose-600/10 rounded-xl cursor-pointer font-black py-3 px-3 mt-1"
                                                        onClick={() => setDeleteTarget(user)}
                                                    >
                                                        <Trash2 className="mr-3 h-4 w-4" /> Purge Account
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-card p-4 rounded-2xl border-2 border-border shadow-sm">
                    <div className="text-sm font-bold text-muted-foreground">
                        Showing page <span className="text-foreground">{page}</span> of <span className="text-foreground">{totalPages}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="rounded-xl font-bold border-2"
                            disabled={page === 1 || isLoading}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-xl font-bold border-2"
                            disabled={page === totalPages || isLoading}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent className="rounded-[2rem] border-2">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl font-black">Purge Account?</AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium italic">
                            You are about to permanently delete <strong>{deleteTarget?.name}</strong>. This action is irreversible and will erase all associated activity logs.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3">
                        <AlertDialogCancel className="rounded-xl font-bold h-12 border-2">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="rounded-xl font-bold h-12 bg-rose-600 hover:bg-rose-700"
                            onClick={() => deleteTarget && deleteUserMutation.mutate(deleteTarget.id)}
                        >
                            Confirm Purge
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] border-2 p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">User Profile</DialogTitle>
                        <DialogDescription className="font-medium italic">Detailed system record.</DialogDescription>
                    </DialogHeader>
                    {viewTarget && (
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-20 w-20 border-2 border-primary/20 shadow-lg">
                                    <AvatarImage src={getMediaUrl(viewTarget.image)} alt={viewTarget.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-black">
                                        {viewTarget.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-black text-2xl tracking-tight leading-none mb-2">{viewTarget.name}</h3>
                                    <div className="flex items-center gap-2 text-muted-foreground font-bold text-sm">
                                        <Mail className="h-4 w-4 text-primary" />
                                        {viewTarget.email}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 p-6 bg-muted/30 rounded-3xl border-2 border-border/50">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Access Level</span>
                                    <p className="font-bold capitalize">{viewTarget.role}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Account Status</span>
                                    <p className={`font-bold ${viewTarget.banned ? 'text-rose-500' : 'text-emerald-500'}`}>{viewTarget.banned ? 'Banned' : 'Active'}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Registration</span>
                                    <p className="font-bold">{format(new Date(viewTarget.createdAt), "MMM d, yyyy")}</p>
                                </div>
                            </div>
                            {viewTarget.banReason && (
                                <div className="p-4 bg-rose-500/10 border-2 border-rose-500/20 rounded-2xl">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Ban Reason</span>
                                    <p className="font-bold text-rose-600 mt-1">{viewTarget.banReason}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
