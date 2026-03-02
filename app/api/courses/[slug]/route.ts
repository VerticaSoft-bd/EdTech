import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Course from '@/models/Course';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        await connectToDatabase();

        // Find the course by slug, populate assigned teachers if necessary
        const course = await Course.findOne({ slug })
            .populate({
                path: 'assignedTeachers',
                select: 'name email profileImage role'
            });

        if (!course) {
            return NextResponse.json(
                { success: false, message: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: course
        });

    } catch (error: any) {
        console.error("Error fetching course details:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch course details' },
            { status: 500 }
        );
    }
}
