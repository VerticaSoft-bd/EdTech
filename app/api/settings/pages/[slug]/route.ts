import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Page from "@/models/Page";

// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI in environment variables.");
    await mongoose.connect(uri);
};

export async function GET(
    request: NextRequest,
    context: any
) {
    try {
        await connectDB();
        
        // Wait for next.js dynamic route params
        const params = await context.params;
        const slug = params.slug;

        let page = await Page.findOne({ slug });

        if (!page) {
            // If it doesn't exist, create an empty one to start with
            const defaultTitles: Record<string, string> = {
                'about-us': 'About Us',
                'careers': 'Careers',
                'partners': 'Partners',
                'privacy-policy': 'Privacy Policy',
                'terms-of-service': 'Terms of Service',
                'cookies': 'Cookies'
            };

            const title = defaultTitles[slug as string] || slug;
            page = new Page({ slug, title, content: '' });
            await page.save();
        }

        return NextResponse.json({ success: true, data: page });
    } catch (error: any) {
        console.error("GET Page Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to fetch page." },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    context: any
) {
    try {
        await connectDB();

        // Wait for next.js dynamic route params
        const params = await context.params;
        const slug = params.slug;
        const body = await request.json();

        const { title, content } = body;

        let page = await Page.findOne({ slug });

        if (!page) {
             page = new Page({ slug, title, content });
             await page.save();
        } else {
             page.title = title;
             page.content = content;
             await page.save();
        }

        return NextResponse.json({ success: true, data: page });
    } catch (error: any) {
        console.error("PUT Page Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to update page." },
            { status: 500 }
        );
    }
}
