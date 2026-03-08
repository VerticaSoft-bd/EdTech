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

        let course;
        // Check if slug is actually a valid MongoDB ObjectId (for dashboard compatibility)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);

        if (isObjectId) {
            course = await Course.findById(slug).populate({
                path: 'assignedTeachers',
                select: 'name email profileImage role'
            });
        } else {
            // Find the course by slug
            course = await Course.findOne({ slug })
                .populate({
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
        console.error("Error fetching course details:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch course details' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const body = await request.json();
        await connectToDatabase();

        let course;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);

        if (isObjectId) {
            course = await Course.findById(slug);
        } else {
            course = await Course.findOne({ slug });
        }

        if (!course) {
            return NextResponse.json(
                { success: false, message: 'Course not found' },
                { status: 404 }
            );
        }

        // Update fields
        Object.keys(body).forEach((key) => {
            if (['id', '_id', '__v', 'createdAt', 'updatedAt'].includes(key)) {
                return; // Prevent updating immutable or internal fields
            }
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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        await connectToDatabase();

        let course;
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);

        if (isObjectId) {
            course = await Course.findByIdAndDelete(slug);
        } else {
            course = await Course.findOneAndDelete({ slug });
        }

        if (!course) {
            return NextResponse.json(
                { success: false, message: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Course deleted successfully'
        });

    } catch (error: any) {
        console.error("Error deleting course:", error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete course' },
            { status: 500 }
        );
    }
}
