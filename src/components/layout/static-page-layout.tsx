"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StaticPageLayoutProps {
    title: string;
    description: string;
    children: ReactNode;
}

export function StaticPageLayout({ title, description, children }: StaticPageLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
                        {title}
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-slate-100 prose prose-slate max-w-none"
                >
                    {children}
                </motion.div>

                <div className="mt-12 text-center text-slate-400 text-sm">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>
        </div>
    );
}
