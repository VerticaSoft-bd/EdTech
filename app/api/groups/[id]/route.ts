import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Group from '@/models/Group';

// PUT: Update an existing group
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Awaiting promise for Next.js 15+
) {
    try {
        const { id } = await params;
        const body = await request.json();
        await connectToDatabase();

        // If trying to rename, check if the new name clashes with another group
        if (body.name) {
            const existingGroup = await Group.findOne({ name: body.name, _id: { $ne: id } });
            if (existingGroup) {
                return NextResponse.json({ success: false, message: 'Another group already uses this name.' }, { status: 400 });
            }
        }

        const group = await Group.findByIdAndUpdate(
            id,
            {
                name: body.name,
                description: body.description,
                status: body.status,
            },
            { new: true, runValidators: true }
        );

        if (!group) {
            return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: group });
    } catch (error: any) {
        console.error("PUT Group error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE: Remove a group
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Awaiting promise for Next.js 15+
) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const group = await Group.findByIdAndDelete(id);

        if (!group) {
            return NextResponse.json({ success: false, message: 'Group not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error: any) {
        console.error("DELETE Group error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
