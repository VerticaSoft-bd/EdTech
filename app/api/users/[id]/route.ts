import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const body = await request.json();
        
        await connectToDatabase();
        
        const updateData: any = {};
        if (body.name) updateData.name = body.name;
        if (body.email) updateData.email = body.email;
        if (body.role) updateData.role = body.role;
        if (body.staffPermissions !== undefined) updateData.staffPermissions = body.staffPermissions;
        
        const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
        
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, message: 'User updated successfully', data: user });
    } catch (error: any) {
        console.error("Update User Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Error updating user' }, { status: 500 });
    }
}
