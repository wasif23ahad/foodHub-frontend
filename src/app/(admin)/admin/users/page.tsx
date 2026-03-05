"use client";

import { useState } from "react";
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
    Filter
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
import { api } from "@/lib/api";
import { User, ApiResponse } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { getMediaUrl } from "@/lib/utils";

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
    const [viewTarget, setViewTarget] = useState<User | null>(null);
    const queryClient = useQueryClient();

    const { data: usersData, isLoading, error } = useQuery({
        queryKey: ["admin-users"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<User[]>>("/admin/users");
                return res.data;
            } catch (err) {
                console.error("Failed to fetch users:", err);
                return [];
            }
        }
    });

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

    const filteredUsers = (usersData || []).filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        const roleLower = role.toLowerCase();
        switch (roleLower) {
            case "admin":
                return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none">Admin</Badge>;
            case "provider":
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Provider</Badge>;
            default:
                return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">Customer</Badge>;
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20 bg-white rounded-xl border border-dashed text-center">
                <div className="p-4 bg-red-100 rounded-full mb-4">
                    <UserIcon className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">Error loading users</h2>
                <p className="text-muted-foreground mb-6">There was a problem communicating with the server.</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">Manage all registered users and their permissions.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-8 px-3">
                        Total: {usersData?.length || 0}
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-background p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-9 bg-muted/30 border-none focus-visible:ring-1"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 min-w-[200px]">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        className="h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="customer">Customer</option>
                        <option value="provider">Provider</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[300px]">User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 rounded-full bg-muted animate-pulse" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><div className="h-6 w-20 bg-muted animate-pulse rounded-full" /></TableCell>
                                    <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
                                    <TableCell className="text-right"><div className="h-8 w-8 ml-auto bg-muted animate-pulse rounded" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <UserIcon className="h-12 w-12 mb-2 opacity-20" />
                                        <p>No users found matching your criteria</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/30 transition-colors group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-muted shadow-sm">
                                                <AvatarImage src={getMediaUrl(user.image)} alt={user.name} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                                                    {user.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="h-3 w-3" /> {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getRoleBadge(user.role)}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.banned ? (
                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Banned</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() => setViewTarget(user)}
                                                >
                                                    <UserIcon className="mr-2 h-4 w-4" /> View Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {!user.banned ? (
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                        onClick={() => banUserMutation.mutate({ userId: user.id, banned: true })}
                                                        disabled={banUserMutation.isPending}
                                                    >
                                                        <UserMinus className="mr-2 h-4 w-4" /> Ban User
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem
                                                        className="text-green-600 focus:text-green-600 focus:bg-green-50 cursor-pointer"
                                                        onClick={() => banUserMutation.mutate({ userId: user.id, banned: false })}
                                                        disabled={banUserMutation.isPending}
                                                    >
                                                        <UserCheck className="mr-2 h-4 w-4" /> Unban User
                                                    </DropdownMenuItem>
                                                )}
                                                {user.role.toUpperCase() !== "ADMIN" && (
                                                    <DropdownMenuItem
                                                        className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                        onClick={() => setDeleteTarget(user)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete User
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email})?
                            This action cannot be undone and will permanently remove all their data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => deleteTarget && deleteUserMutation.mutate(deleteTarget.id)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* View Profile Dialog */}
            <Dialog open={!!viewTarget} onOpenChange={(open) => !open && setViewTarget(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>User Profile</DialogTitle>
                        <DialogDescription>Detailed user information.</DialogDescription>
                    </DialogHeader>
                    {viewTarget && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16 border-2 border-primary/10">
                                    <AvatarImage src={getMediaUrl(viewTarget.image)} alt={viewTarget.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                        {viewTarget.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-lg">{viewTarget.name}</h3>
                                    <p className="text-sm text-muted-foreground">{viewTarget.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div><span className="text-muted-foreground">Role:</span> <span className="font-medium capitalize">{viewTarget.role}</span></div>
                                <div><span className="text-muted-foreground">Status:</span> <span className={`font-medium ${viewTarget.banned ? 'text-red-600' : 'text-green-600'}`}>{viewTarget.banned ? 'Banned' : 'Active'}</span></div>
                                <div><span className="text-muted-foreground">Joined:</span> <span className="font-medium">{format(new Date(viewTarget.createdAt), "MMM d, yyyy")}</span></div>
                                {viewTarget.banReason && (
                                    <div className="col-span-2"><span className="text-muted-foreground">Ban Reason:</span> <span className="font-medium text-red-600">{viewTarget.banReason}</span></div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
