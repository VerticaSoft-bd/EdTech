"use client";

import React from "react";

const SkeletonPulse = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}></div>
);

const CardSkeleton = () => (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col h-full shadow-sm">
        <div className="aspect-[16/10] bg-gray-200"></div>
        <div className="p-5 flex-1 flex flex-col gap-4">
            <div className="flex gap-2">
                <SkeletonPulse className="h-4 w-16" />
                <SkeletonPulse className="h-4 w-16" />
            </div>
            <SkeletonPulse className="h-6 w-full" />
            <SkeletonPulse className="h-6 w-3/4" />
            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SkeletonPulse className="w-9 h-9 rounded-full" />
                    <div className="space-y-1">
                        <SkeletonPulse className="h-2 w-12" />
                        <SkeletonPulse className="h-3 w-16" />
                    </div>
                </div>
                <SkeletonPulse className="w-8 h-8 rounded-lg" />
            </div>
        </div>
    </div>
);

const TestimonialSkeleton = ({ dark = false }) => (
    <div className="flex flex-col gap-6">
        <div className="aspect-[9/16] bg-gray-200 rounded-2xl animate-pulse"></div>
        <div className={`p-6 rounded-2xl h-32 animate-pulse ${dark ? 'bg-[#1c222c]' : 'bg-gray-100'}`}>
            <div className="space-y-2">
                <SkeletonPulse className="h-3 w-full opacity-50" />
                <SkeletonPulse className="h-3 w-5/6 opacity-50" />
                <SkeletonPulse className="h-3 w-4/6 opacity-50" />
            </div>
        </div>
    </div>
);

export default function HomeSkeleton() {
    return (
        <main className="flex-1 flex flex-col items-center w-full max-w-[1300px] mx-auto px-4 sm:px-6 py-8 md:py-12 gap-16">
            
            {/* Hero Section Skeleton */}
            <div className="w-full relative overflow-hidden rounded-2xl md:rounded-3xl bg-gray-100 h-[650px] md:min-h-[500px] lg:h-[600px] shadow-sm animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                <div className="absolute inset-x-8 md:inset-x-20 top-1/2 -translate-y-1/2 max-w-2xl space-y-6">
                    <SkeletonPulse className="h-6 w-32 bg-gray-300" />
                    <SkeletonPulse className="h-16 w-full bg-gray-300" />
                    <SkeletonPulse className="h-16 w-3/4 bg-gray-300" />
                    <SkeletonPulse className="h-20 w-full bg-gray-300" />
                    <div className="flex gap-4">
                        <SkeletonPulse className="h-12 w-40 bg-gray-300" />
                        <SkeletonPulse className="h-12 w-40 bg-gray-300" />
                    </div>
                </div>
            </div>

            {/* Category Tabs Skeleton */}
            <div className="flex justify-center w-full mt-8 lg:mt-12 px-4 pb-8">
                <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex gap-2">
                    {[1, 2, 3].map((i) => (
                        <SkeletonPulse key={i} className="h-12 w-32 md:w-40" />
                    ))}
                </div>
            </div>

            {/* Upcoming Batches Section */}
            <section className="w-full pt-4">
                <div className="flex items-center gap-3 mb-8">
                    <SkeletonPulse className="w-5 h-2 rounded-full" />
                    <SkeletonPulse className="h-8 w-64" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </section>

            {/* Special Packages Section */}
            <section className="w-full py-12 relative">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 px-2 gap-4">
                    <div className="space-y-4">
                        <SkeletonPulse className="h-5 w-24" />
                        <SkeletonPulse className="h-10 w-80" />
                        <SkeletonPulse className="h-4 w-64" />
                    </div>
                    <SkeletonPulse className="h-6 w-32" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </section>

            {/* Free Classes (Dark Theme) Skeleton */}
            <section className="w-full bg-[#181C25] rounded-[1.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden mt-6">
                <div className="flex justify-center mb-10">
                    <SkeletonPulse className="h-10 w-64 bg-gray-700" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-[#1E232F] border border-gray-700/50 rounded-xl p-4 h-[300px] flex flex-col gap-4">
                            <SkeletonPulse className="h-32 w-full bg-gray-800" />
                            <SkeletonPulse className="h-4 w-1/2 bg-gray-800" />
                            <SkeletonPulse className="h-6 w-full bg-gray-800" />
                            <SkeletonPulse className="h-10 w-full mt-auto bg-gray-800" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Skeleton */}
            <section className="w-full pb-20 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="space-y-2">
                        <SkeletonPulse className="h-8 w-80" />
                        <SkeletonPulse className="h-4 w-64" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <TestimonialSkeleton key={i} dark={i % 2 === 0} />
                    ))}
                </div>
            </section>

            {/* What You Will Get Skeleton */}
            <section className="w-full py-24 relative overflow-hidden">
                <div className="text-center mb-20">
                    <SkeletonPulse className="h-6 w-32 mx-auto mb-4" />
                    <SkeletonPulse className="h-10 w-80 mx-auto" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center gap-6">
                            <SkeletonPulse className="w-24 h-24 rounded-[32px]" />
                            <SkeletonPulse className="h-6 w-48" />
                            <SkeletonPulse className="h-1 w-20" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Teacher Profiles Skeleton */}
            <section className="w-full pb-20">
                <SkeletonPulse className="h-10 w-64 mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                            <SkeletonPulse className="aspect-square w-full rounded-xl" />
                            <SkeletonPulse className="h-6 w-3/4" />
                            <SkeletonPulse className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Brands Skeleton */}
            <div className="w-full py-12 border-t border-gray-100">
                <div className="flex justify-between items-center opacity-50">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <SkeletonPulse key={i} className="h-8 w-24" />
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite linear;
                }
            `}</style>
        </main>
    );
}
