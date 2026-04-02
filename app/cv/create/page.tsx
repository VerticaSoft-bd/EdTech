// app/cv/create/page.tsx
'use client';
import CvBuilder from '@/app/components/cv/CvBuilder';
// Make sure you have a Footer component
import { Suspense } from 'react';

export default function CreateCvPage() {
    return (
        <div>
            <main>
                <Suspense fallback={<div className="flex items-center justify-center" style={{ height: 'calc(100vh - 150px)' }}>Loading Builder...</div>}>
                    <CvBuilder />
                </Suspense>
            </main>
        </div>
    );
}