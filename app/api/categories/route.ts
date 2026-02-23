import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';

// GET all categories
export async function GET() {
    try {
        await connectToDatabase();
        // Sort by createdAt descending (newest first)
        const categories = await Category.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: categories }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST create a new category
export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();

        // Add default color if not provided
        if (!body.color) {
            body.color = "from-[#8E8AFF] to-[#B4B1FF]";
        }

        const category = await Category.create(body);
        return NextResponse.json({ success: true, data: category }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
