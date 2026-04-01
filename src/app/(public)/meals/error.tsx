"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function MealsError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error("Meals page error:", error);
    }, [error]);

    return (
        <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
                Oops! Something went wrong!
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
                We couldn't load the meals. This might be due to a network issue or a temporary server problem.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} size="lg">
                    Try Again
                </Button>
                <Link href="/">
                    <Button variant="outline" size="lg">
                        Go Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
