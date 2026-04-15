import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function GET() {
    try {
        await connectToDatabase();
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: coupons });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (!body.code || !body.discountType || !body.discountValue || !body.expiryDate) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();
        
        // Ensure code is uppercase
        body.code = body.code.toUpperCase();

        const newCoupon = await Coupon.create(body);
        return NextResponse.json({ success: true, message: 'Coupon created successfully', data: newCoupon }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: 'Coupon code already exists' }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
