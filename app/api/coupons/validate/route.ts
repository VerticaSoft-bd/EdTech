import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json(
                { success: false, message: 'Please provide a coupon code' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase(),
            isActive: true,
            expiryDate: { $gte: new Date() }
        });

        if (!coupon) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired coupon code' },
                { status: 404 }
            );
        }

        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return NextResponse.json(
                { success: false, message: 'Coupon usage limit reached' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Coupon applied successfully',
            data: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            }
        });

    } catch (error: any) {
        console.error("Coupon Validation Error:", error);
        return NextResponse.json(
            { success: false, message: 'An error occurred during coupon validation' },
            { status: 500 }
        );
    }
}
