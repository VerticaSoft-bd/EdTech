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
