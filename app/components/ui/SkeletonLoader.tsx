// components/ui/SkeletonLoader.tsx
import React from 'react';

const SkeletonLine = ({ width = 'w-full', height = 'h-4' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${width} ${height}`}></div>
);

export const CvBuilderSkeleton = () => (
    <div className="grid grid-cols-10">
        {/* Left Side Skeleton */}
        <div className="col-span-6 bg-white p-8 space-y-10 border-r border-gray-200">
            <div>
                <SkeletonLine width="w-1/3" height="h-6" />
                <div className="mt-4 space-y-4 p-4 rounded-lg">
                    <SkeletonLine width="w-1/2" />
                    <SkeletonLine />
                </div>
            </div>
            <div>
                <SkeletonLine width="w-1/3" height="h-6" />
                <div className="mt-4 space-y-4 p-4 rounded-lg">
                    <SkeletonLine width="w-1/2" />
                    <SkeletonLine />
                </div>
            </div>
        </div>
        {/* Right Side Skeleton */}
        <div className="col-span-4 bg-gray-50 p-8 space-y-8">
            <div className="flex items-start gap-4">
                <div className="w-3/4 space-y-2">
                    <SkeletonLine width="w-full" height="h-8" />
                    <SkeletonLine width="w-1/2" />
                </div>
                <div className="animate-pulse bg-gray-200 rounded-md w-24 h-24"></div>
            </div>
            <div className="space-y-4">
                <SkeletonLine width="w-1/4" height="h-6" />
                <SkeletonLine />
                <SkeletonLine width="w-5/6" />
            </div>
        </div>
    </div>
);


export const CvListSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        <div className="flex justify-between items-center">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="space-y-3">
            <div className="p-4 border rounded-lg h-20 bg-gray-200"></div>
            <div className="p-4 border rounded-lg h-20 bg-gray-200"></div>
            <div className="p-4 border rounded-lg h-20 bg-gray-200"></div>
        </div>
    </div>
);