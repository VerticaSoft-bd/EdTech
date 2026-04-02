// app/cv/create/page.tsx
'use client';
import CvBuilder from '@/components/cv/CvBuilder';
import Navbar from '@/components/Header';
import Footer from '@/components/Footer'; // Make sure you have a Footer component
import { Suspense, useContext } from 'react';
import AppContext from '@/app/context/appContext';

export default function CreateCvPage() {
    const {user} =useContext(AppContext);
    return (
        <div>
            <Navbar user={user} /> {/* Pass user data if available */}
            <main>
                <Suspense fallback={<div className="flex items-center justify-center" style={{height: 'calc(100vh - 150px)'}}>Loading Builder...</div>}>
                    <CvBuilder />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}