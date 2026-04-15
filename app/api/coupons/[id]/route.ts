import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();

        await connectToDatabase();
        
        if (body.code) {
            body.code = body.code.toUpperCase();
        }

        const updatedCoupon = await Coupon.findByIdAndUpdate(id, body, { new: true });
        
        if (!updatedCoupon) {
            return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Coupon updated successfully', data: updatedCoupon });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await connectToDatabase();
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        
        if (!deletedCoupon) {
            return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
