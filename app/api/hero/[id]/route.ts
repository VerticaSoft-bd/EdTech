import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const slide = await HeroSlide.findById(id);
        if (!slide) {
            return NextResponse.json({ success: false, message: 'Slide not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: slide });
    } catch (error: any) {
        console.error("Fetch Single Hero Slide Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        await connectToDatabase();
        const updatedSlide = await HeroSlide.findByIdAndUpdate(id, body, { new: true });
        if (!updatedSlide) {
            return NextResponse.json({ success: false, message: 'Slide not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updatedSlide });
    } catch (error: any) {
        console.error("Update Hero Slide Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const deletedSlide = await HeroSlide.findByIdAndDelete(id);
        if (!deletedSlide) {
            return NextResponse.json({ success: false, message: 'Slide not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: 'Slide deleted successfully' });
    } catch (error: any) {
        console.error("Delete Hero Slide Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
