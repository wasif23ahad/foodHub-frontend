"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { api } from "@/lib/api";
import { ApiResponse, Meal } from "@/types";

interface Props {
  mealId: string;
}

export function CitationChip({ mealId }: Props) {
  const addToCart = useCartStore((s) => s.addItem);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["meal-chip", mealId],
    queryFn: () => api.get<ApiResponse<Meal>>(`/meals/${mealId}`).then((r) => r.data),
    staleTime: 5 * 60 * 1000, // 5 min — meal data rarely changes
    retry: false,
  });

  // Silently drop unknown / malformed IDs. Better to skip than show a broken chip.
  if (isError || (!isLoading && !data)) return null;

  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs my-1 mx-1">
        <span className="h-4 w-4 animate-pulse rounded-full bg-muted" />
        <span className="h-3 w-16 animate-pulse rounded bg-muted" />
      </span>
    );
  }

  if (!data) return null;

  return (
    <span className="my-1 mx-0.5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 text-xs shadow-sm hover:border-primary/40 hover:shadow-md transition align-middle">
      <Link
        href={`/meals/${data.id}`}
        className="inline-flex items-center gap-2 group"
        target="_blank"
      >
        {data.image && (
          <Image
            src={data.image}
            alt={data.name}
            width={20}
            height={20}
            className="h-5 w-5 rounded-full object-cover"
          />
        )}
        <span className="font-semibold text-foreground group-hover:text-primary">
          {data.name}
        </span>
        <span className="text-muted-foreground">৳{data.price}</span>
      </Link>
      <button
        type="button"
        aria-label={`Add ${data.name} to cart`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          addToCart(data, 1);
        }}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
      >
        <Plus className="h-3 w-3" />
      </button>
    </span>
  );
}
