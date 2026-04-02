// app/cv/list/page.tsx
'use client';
import Navbar from '@/components/Header';
import Footer from '@/components/Footer'; // Assuming you have a Footer component
import YourCvs from '@/components/cv/YourCvs';
import { useContext } from 'react';
import appContext from '@/app/context/appContext';

export default function CvListPage() {
    const {user}= useContext(appContext);
    return (
        <div>
            <Navbar user={user} /> {/* Pass user data if available */}
            <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* The YourCvs component is self-contained and will handle fetching and display */}
                    <YourCvs />
                </div>
            </main>
            <Footer />
        </div>
    );
}