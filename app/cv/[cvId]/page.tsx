// app/cv/[cvId]/page.tsx
'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

// Load builder only on the client to avoid SSR issues
const CvBuilder = dynamic(() => import('@/app/components/cv/CvBuilder'), { ssr: false });

export default function EditCvPage() {

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A1D1F] flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 150px)' }}>
            Loading Builder...
          </div>
        }>
          <CvBuilder />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}