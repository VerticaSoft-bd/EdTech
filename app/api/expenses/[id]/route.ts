import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Expense from '@/models/Expense';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        await connectToDatabase();

        const expense = await Expense.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!expense) {
            return NextResponse.json(
                { success: false, message: 'Expense not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: expense, message: 'Expense updated successfully' });
    } catch (error: any) {
        console.error('Update Expense Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to update expense' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await connectToDatabase();

        const expense = await Expense.findByIdAndDelete(id);

        if (!expense) {
            return NextResponse.json(
                { success: false, message: 'Expense not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Expense deleted successfully' });
    } catch (error: any) {
        console.error('Delete Expense Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to delete expense' },
            { status: 500 }
        );
    }
}
