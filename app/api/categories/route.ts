import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import Course from '@/models/Course';
import AWS from 'aws-sdk';

// Next.js 15: Force this API to never cache GET responses
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// GET all categories
export async function GET() {
    try {
        await connectToDatabase();
        // Sort by createdAt descending (newest first)
        const categories = await Category.find({}).sort({ createdAt: -1 });

        // Count courses for each category dynamically
        const categoriesWithCount = await Promise.all(categories.map(async (cat) => {
            const count = await Course.countDocuments({ category: cat.name });
            return {
                ...cat.toObject(),
                courseCount: count
            };
        }));

        return NextResponse.json({ success: true, data: categoriesWithCount }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create a new category
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        const { name, description, status, color, thumbnail } = body;

        const payload = {
            name,
            description,
            status,
            color: color || "from-[#8E8AFF] to-[#B4B1FF]",
            thumbnail: thumbnail || ''
        };

        const category = await Category.create(payload);
        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error: any) {
        console.error("Category Creation Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
