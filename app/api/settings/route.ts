import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';

// GET - Fetch site settings (returns single settings doc, creates default if none exists)
export async function GET() {
    try {
        await connectDB();
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create({});
        }
        // Fill in defaults for legacy records with empty logo/favicon
        if (!settings.logo) { settings.logo = '/images/logo.png'; await settings.save(); }
        if (!settings.favicon) { settings.favicon = '/favicon.ico'; await settings.save(); }
        return NextResponse.json({ success: true, data: settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT - Update site settings
export async function PUT(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create(body);
        } else {
            Object.assign(settings, body);
            await settings.save();
        }

        return NextResponse.json({ success: true, data: settings });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
