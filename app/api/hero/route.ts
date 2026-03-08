import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';

export async function GET() {
    try {
        await connectToDatabase();
        const slides = await HeroSlide.find({}).sort({ order: 1 });
        return NextResponse.json({ success: true, data: slides });
    } catch (error: any) {
        console.error("Fetch Hero Slides Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await connectToDatabase();
        const newSlide = await HeroSlide.create(body);
        return NextResponse.json({ success: true, data: newSlide }, { status: 201 });
    } catch (error: any) {
        console.error("Create Hero Slide Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
