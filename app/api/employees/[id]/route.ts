import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Employee from '@/models/Employee';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        await connectToDatabase();

        const employee = await Employee.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!employee) {
            return NextResponse.json(
                { success: false, message: 'Employee not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: employee, message: 'Employee updated successfully' });
    } catch (error: any) {
        console.error('Update Employee Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to update employee' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await connectToDatabase();

        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            return NextResponse.json(
                { success: false, message: 'Employee not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Employee deleted successfully' });
    } catch (error: any) {
        console.error('Delete Employee Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to delete employee' },
            { status: 500 }
        );
    }
}
