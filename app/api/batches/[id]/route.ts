import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Batch from '@/models/Batch';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const updatedBatch = await Batch.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).populate('teachers', 'name email avatar');

        if (!updatedBatch) {
            return NextResponse.json({ success: false, message: 'Batch not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedBatch });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedBatch = await Batch.findByIdAndDelete(id);

        if (!deletedBatch) {
            return NextResponse.json({ success: false, message: 'Batch not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
