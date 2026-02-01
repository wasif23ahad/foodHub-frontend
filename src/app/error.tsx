"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Critical System Error:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-red-50 p-6 rounded-full mb-6">
                <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Something went wrong!</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                We apologize for the inconvenience. A critical error has occurred in the application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                    onClick={() => reset()}
                    variant="default"
                    size="lg"
                    className="gap-2"
                >
                    <RotateCcw className="h-4 w-4" /> Try again
                </Button>
                <Link href="/">
                    <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                        <Home className="h-4 w-4" /> Back to Home
                    </Button>
                </Link>
            </div>
            {error.digest && (
                <p className="mt-8 text-xs text-muted-foreground font-mono">
                    Error ID: {error.digest}
                </p>
            )}
        </div>
    );
}
