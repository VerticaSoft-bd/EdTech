import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Course from '@/models/Course';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        let course;
        // Check if id is a valid MongoDB ObjectId
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

        if (isObjectId) {
            course = await Course.findById(id).populate({
                path: 'assignedTeachers',
                select: 'name email profileImage role'
            });
        } else {
            // If not ObjectId, treat as slug
            course = await Course.findOne({ slug: id }).populate({
                path: 'assignedTeachers',
                select: 'name email profileImage role'
            });
        }

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
        console.error("Error fetching course:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch course details' },
            { status: 500 }
        );
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

        const course = await Course.findById(id);

        if (!course) {
            return NextResponse.json(
                { success: false, message: 'Course not found' },
                { status: 404 }
            );
        }

        // Update fields
        Object.keys(body).forEach((key) => {
            (course as any)[key] = body[key];
        });

        // Save will trigger pre-save hooks (like slug generation if title changed)
        await course.save();

        return NextResponse.json({
            success: true,
            message: 'Course updated successfully',
            data: course
        });

    } catch (error: any) {
        console.error("Error updating course:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to update course' },
            { status: 500 }
        );
    }
}
