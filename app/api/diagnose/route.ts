import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
    try {
        await connectDB();
        const settingsList = await SiteSettings.find({});
        return NextResponse.json({
            success: true,
            totalDocs: settingsList.length,
            docs: settingsList.map(s => ({
                _id: s._id,
                siteName: s.siteName,
                freeClassesCount: s.freeClasses?.length || 0,
                testimonialsCount: s.testimonials?.length || 0,
                firstFreeClass: s.freeClasses?.[0]?.title
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
