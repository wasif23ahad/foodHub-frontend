"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, MoreHorizontal, Tags, Edit, Trash, ImageIcon, Save, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { Category, ApiResponse } from "@/types";
import { toast } from "sonner";
import { getMediaUrl } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/ui/image-upload";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Switch } from "@/components/ui/switch";

// Schemas matching Backend
const categorySchema = z.object({
    name: z.string().min(2, "Category name must be at least 2 characters").max(50),
    description: z.string().max(500).optional(),
    image: z.string().optional(),
    isFeatured: z.boolean().default(false).optional(),
});
type CategoryFormData = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();

    // Dialogs state
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

    const { data: categoriesData, isLoading, error } = useQuery({
        queryKey: ["admin-categories"],
        queryFn: async () => {
            try {
                const res = await api.get<ApiResponse<Category[]>>("/categories");
                return res.data;
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                return [];
            }
        }
    });

    const categories = categoriesData || [];
    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
    );

    // Form setup for Create/Edit
    const form = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: { name: "", description: "", image: "", isFeatured: false }
    });

    // Reset form when edit modal opens
    const handleOpenEdit = (category: Category) => {
        setEditCategory(category);
        form.reset({
            name: category.name,
            description: category.description || "",
            image: category.image || "",
            isFeatured: category.isFeatured || false
        });
    };

    // Prepare create modal
    const handleOpenCreate = () => {
        form.reset({ name: "", description: "", image: "", isFeatured: false });
        setIsCreateOpen(true);
    };

    // Mutations
    const createMutation = useMutation({
        mutationFn: async (data: CategoryFormData) => {
            const payload = { ...data, image: data.image || undefined };
            return api.post<ApiResponse<Category>>("/admin/categories", payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category created successfully");
            setIsCreateOpen(false);
            form.reset();
        },
        onError: (err: any) => toast.error(err.message || "Failed to create category")
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: CategoryFormData }) => {
            const payload = { ...data, image: data.image || undefined };
            return api.put<ApiResponse<Category>>(`/admin/categories/${id}`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category updated successfully");
            setEditCategory(null);
            form.reset();
        },
        onError: (err: any) => toast.error(err.message || "Failed to update category")
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.delete(`/admin/categories/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success("Category deleted successfully");
            setDeleteCategory(null);
        },
        onError: (err: any) => toast.error(err.message || "Failed to delete category")
    });

    const onSubmit = (data: CategoryFormData) => {
        if (editCategory) {
            updateMutation.mutate({ id: editCategory.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <EmptyState
                    icon={Tags}
                    title="Error loading categories"
                    description="We couldn't retrieve the system categories. Please check your connection."
                >
                    <Button onClick={() => window.location.reload()} className="mt-4 rounded-xl font-bold border-2" variant="outline">Try Again</Button>
                </EmptyState>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Category Management</h1>
                    <p className="text-muted-foreground mt-1 font-medium italic">Define and organize the food catalog.</p>
                </div>
                <Button 
                    onClick={handleOpenCreate} 
                    className="h-14 rounded-2xl px-8 gap-3 font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus className="h-5 w-5" />
                    Create Category
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search categories by name or description..."
                        className="pl-12 h-14 bg-card border-2 border-border rounded-2xl focus:border-primary/20 focus:ring-primary/10 transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Badge variant="outline" className="h-10 px-6 rounded-2xl font-black border-2 text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px] shrink-0">
                    Total: {categories.length}
                </Badge>
            </div>

            <div className="rounded-[2.5rem] border-2 border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30 border-b-2 border-border hover:bg-muted/30 transition-none">
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Preview</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Category Name</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Description</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Featured</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Created</TableHead>
                                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell className="px-8 py-6"><div className="h-14 w-14 bg-muted animate-pulse rounded-xl" /></TableCell>
                                    <TableCell><div className="h-6 w-32 bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-64 bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell><div className="h-6 w-20 bg-muted animate-pulse rounded-full" /></TableCell>
                                    <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                                    <TableCell className="text-right px-8"><div className="h-10 w-10 ml-auto bg-muted animate-pulse rounded-xl" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredCategories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-24 text-center">
                                    <EmptyState
                                        icon={Tags}
                                        title="No categories found"
                                        description={search ? `No matches for "${search}".` : "The category list is currently empty."}
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCategories.map(cat => (
                                <TableRow key={cat.id} className="hover:bg-muted/30 transition-all group/row border-b border-border/50">
                                    <TableCell className="px-8 py-6">
                                        <div className="h-16 w-16 rounded-[1.25rem] overflow-hidden bg-muted flex items-center justify-center border-2 border-border shadow-sm group-hover/row:scale-110 transition-transform">
                                            {cat.image ? (
                                                <img src={getMediaUrl(cat.image)} alt={cat.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        <div className="font-black text-foreground text-lg leading-tight group-hover/row:text-primary transition-colors">{cat.name}</div>
                                        <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-black">System Category</div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        <div className="text-sm text-muted-foreground font-medium italic line-clamp-2 max-w-[300px]">
                                            {cat.description || "No description provided"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-8 py-6">
                                        {cat.isFeatured ? (
                                            <Badge className="bg-amber-500/10 text-amber-600 border-2 border-amber-500/20 px-3 py-1 rounded-xl font-black text-[10px] uppercase tracking-widest flex w-fit gap-1.5 items-center shadow-sm shadow-amber-500/5">
                                                <Sparkles className="h-3 w-3" />
                                                Featured
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-muted-foreground/60 border-2 border-border/50 px-3 py-1 rounded-xl font-black text-[10px] uppercase tracking-widest">
                                                Regular
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-sm text-muted-foreground font-bold">
                                        {format(new Date(cat.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="px-8 py-6 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm">
                                                    <MoreHorizontal className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-3 shadow-2xl border-2 border-border">
                                                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Category Settings</DropdownMenuLabel>
                                                <DropdownMenuItem className="rounded-xl cursor-pointer py-3 px-3 font-bold" onClick={() => handleOpenEdit(cat)}>
                                                    <Edit className="h-4 w-4 mr-3 text-primary" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="my-2 bg-border/50" />
                                                <DropdownMenuItem className="text-rose-600 focus:text-rose-600 focus:bg-rose-600/10 rounded-xl cursor-pointer font-black py-3 px-3" onClick={() => setDeleteCategory(cat)}>
                                                    <Trash className="h-4 w-4 mr-3" /> Purge Category
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>

            {/* Create / Edit Dialog */}
            <Dialog open={isCreateOpen || !!editCategory} onOpenChange={(open) => {
                if (!open) {
                    setIsCreateOpen(false);
                    setEditCategory(null);
                    form.reset();
                }
            }}>
                <DialogContent className="sm:max-w-xl rounded-[2.5rem] border-2 p-8 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black text-foreground">{editCategory ? "Edit Category" : "New Category"}</DialogTitle>
                        <DialogDescription className="text-base font-medium italic">
                            {editCategory ? "Update existing catalog definitions." : "Add a new flavor profile to the system."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Display Name <span className="text-rose-500">*</span></Label>
                            <Input id="name" {...form.register("name")} placeholder="e.g. Deshi Platters" className="h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium" disabled={updateMutation.isPending || createMutation.isPending} />
                            {form.formState.errors.name && <p className="text-xs text-rose-500 font-bold ml-1">{form.formState.errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Meta Description</Label>
                            <Textarea id="description" {...form.register("description")} placeholder="Briefly describe what makes this category unique..." className="min-h-[100px] rounded-2xl border-2 focus-visible:ring-primary/20 bg-background font-medium resize-none" disabled={updateMutation.isPending || createMutation.isPending} />
                            {form.formState.errors.description && <p className="text-xs text-rose-500 font-bold ml-1">{form.formState.errors.description.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Cover Asset</Label>
                            <ImageUpload
                                value={form.watch("image")}
                                onChange={(url) => form.setValue("image", url, { shouldValidate: true })}
                                onRemove={() => form.setValue("image", "", { shouldValidate: true })}
                            />
                        </div>

                        <div className="flex items-center justify-between p-6 bg-muted/30 rounded-3xl border-2 border-border/50">
                            <div className="space-y-0.5">
                                <Label htmlFor="isFeatured" className="text-base font-bold cursor-pointer">Featured Category</Label>
                                <p className="text-xs text-muted-foreground font-medium italic">Prioritize this category on the homepage.</p>
                            </div>
                            <Switch 
                                checked={form.watch("isFeatured")}
                                onCheckedChange={(val) => form.setValue("isFeatured", val)}
                            />
                        </div>

                        <DialogFooter className="pt-6">
                            <Button type="button" variant="ghost" onClick={() => { setIsCreateOpen(false); setEditCategory(null); }} className="rounded-xl font-bold h-12">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updateMutation.isPending || createMutation.isPending} className="rounded-2xl font-black h-12 px-8 shadow-lg shadow-primary/20">
                                {(updateMutation.isPending || createMutation.isPending) ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                {editCategory ? "Update Category" : "Establish Category"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteCategory} onOpenChange={(open) => !open && setDeleteCategory(null)}>
                <DialogContent className="rounded-[2.5rem] border-2 p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-foreground">Purge Category Definition?</DialogTitle>
                        <DialogDescription className="text-base font-medium italic">
                            Are you sure you want to permanently delete <span className="font-black text-rose-600 not-italic">{deleteCategory?.name}</span>? 
                            This action may cause synchronization issues with existing meals.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 pt-6">
                        <Button type="button" variant="ghost" onClick={() => setDeleteCategory(null)} className="rounded-xl font-bold h-12">Cancel</Button>
                        <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={() => deleteCategory && deleteMutation.mutate(deleteCategory.id)}
                            disabled={deleteMutation.isPending}
                            className="rounded-xl font-black h-12 bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-500/20"
                        >
                            {deleteMutation.isPending ? "Purging..." : "Confirm Purge"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
