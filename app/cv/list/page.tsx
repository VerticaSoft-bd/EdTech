// app/cv/list/page.tsx
'use client';
// Assuming you have a Footer component
import YourCvs from '@/app/components/cv/YourCvs';


export default function CvListPage() {

    return (
        <div>

            <main className="min-h-screen bg-gray-100 p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    {/* The YourCvs component is self-contained and will handle fetching and display */}
                    <YourCvs />
                </div>
            </main>

        </div>
    );
}