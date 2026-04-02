// app/cv/[cvId]/page.tsx
'use client';

import React, { Suspense, useContext } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Header';
import Footer from '@/components/Footer';
import appContext from '@/app/context/appContext';

// Load builder only on the client to avoid SSR issues
const CvBuilder = dynamic(() => import('@/components/cv/CvBuilder'), { ssr: false });

export default function EditCvPage() {
  const { user } = useContext(appContext);

  return (
    <div>
      <Navbar user={user} />
      <main>
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