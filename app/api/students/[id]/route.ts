import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectToDatabase();
        const student = await Student.findById(id);

        if (!student) {
            return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: student });
    } catch (error: any) {
        console.error("Fetch Student Error:", error);
        return NextResponse.json({ success: false, message: 'An error occurred while fetching student details' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        await connectToDatabase();

        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Student updated successfully',
            data: updatedStudent
        });
    } catch (error: any) {
        console.error("Update Student Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred during student update' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const student = await Student.findById(id);
        if (!student) {
            return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
        }

        // 1. Cleanup avatar from S3
        if (student.avatar) {
            const { deleteFromS3 } = await import('@/lib/s3-client');
            await deleteFromS3(student.avatar);
        }

        // 2. Delete the student
        await Student.findByIdAndDelete(id);

        // 3. Optional: Delete related User account if it exists (smart approach)
        const User = (await import('@/models/User')).default;
        await User.findOneAndDelete({ email: student.email });

        // 4. Also cleanup related data like attendance (optional but smart)
        const Attendance = (await import('@/models/Attendance')).default;
        await Attendance.deleteMany({ student: id });

        return NextResponse.json({
            success: true,
            message: 'Student and related records deleted successfully'
        });
    } catch (error: any) {
        console.error("Delete Student Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred during deletion' },
            { status: 500 }
        );
    }
}
