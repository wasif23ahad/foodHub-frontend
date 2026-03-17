"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, MoreHorizontal, Tags, Edit, Trash, ImageIcon } from "lucide-react";
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
            // Strip empty image string — backend URL validator rejects ''
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
            // Strip empty image string — backend URL validator rejects ''
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
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <Tags className="h-10 w-10 text-destructive mb-4" />
                <h2 className="text-xl font-bold">Failed to load categories</h2>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
                    <p className="text-muted-foreground">Manage food categories for providers and meals.</p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4 bg-background p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search categories..."
                        className="pl-9 bg-muted/30"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Badge variant="secondary" className="px-3">Total: {categories.length}</Badge>
            </div>

            {/* Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead className="w-[200px]">Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[100px]">Featured</TableHead>
                            <TableHead className="w-[150px]">Created</TableHead>
                            <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell></TableRow>
                        ) : filteredCategories.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="h-48 text-center text-muted-foreground">No categories found.</TableCell></TableRow>
                        ) : (
                            filteredCategories.map(cat => (
                                <TableRow key={cat.id}>
                                    <TableCell>
                                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex items-center justify-center border">
                                            {cat.image ? (
                                                <img src={getMediaUrl(cat.image)} alt={cat.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-muted-foreground truncate max-w-[300px]">
                                        {cat.description || "No description"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={cat.isFeatured ? "default" : "secondary"}>
                                            {cat.isFeatured ? "Featured" : "Regular"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {format(new Date(cat.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleOpenEdit(cat)}>
                                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteCategory(cat)}>
                                                    <Trash className="h-4 w-4 mr-2" /> Delete
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

            {/* Create / Edit Dialog */}
            <Dialog open={isCreateOpen || !!editCategory} onOpenChange={(open) => {
                if (!open) {
                    setIsCreateOpen(false);
                    setEditCategory(null);
                    form.reset();
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editCategory ? "Edit Category" : "Create Category"}</DialogTitle>
                        <DialogDescription>
                            {editCategory ? "Update the details of the category below." : "Add a new category to the platform."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                            <Input id="name" {...form.register("name")} placeholder="e.g. Deshi" disabled={updateMutation.isPending || createMutation.isPending} />
                            {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" {...form.register("description")} placeholder="Brief description" disabled={updateMutation.isPending || createMutation.isPending} />
                            {form.formState.errors.description && <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Category Image</Label>
                            <ImageUpload
                                value={form.watch("image")}
                                onChange={(url) => form.setValue("image", url, { shouldValidate: true })}
                                onRemove={() => form.setValue("image", "", { shouldValidate: true })}
                            />
                            {form.formState.errors.image && <p className="text-sm text-destructive">{form.formState.errors.image.message}</p>}
                        </div>

                        <div className="flex items-center space-x-2 py-2">
                            <input
                                type="checkbox"
                                id="isFeatured"
                                {...form.register("isFeatured")}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                disabled={updateMutation.isPending || createMutation.isPending}
                            />
                            <Label htmlFor="isFeatured" className="cursor-pointer">Feature on homepage</Label>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => { setIsCreateOpen(false); setEditCategory(null); }}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updateMutation.isPending || createMutation.isPending}>
                                {(updateMutation.isPending || createMutation.isPending) ? "Saving..." : "Save Category"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteCategory} onOpenChange={(open) => !open && setDeleteCategory(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-foreground">{deleteCategory?.name}</span>? 
                            This action cannot be undone and may affect meals associated with this category.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeleteCategory(null)}>Cancel</Button>
                        <Button 
                            type="button" 
                            variant="destructive" 
                            onClick={() => deleteCategory && deleteMutation.mutate(deleteCategory.id)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete Category"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
