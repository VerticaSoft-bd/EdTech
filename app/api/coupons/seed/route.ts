import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function GET() {
    try {
        await connectToDatabase();
        
        const coupons = [
            {
                code: 'SAVE10',
                discountType: 'Percentage',
                discountValue: 10,
                expiryDate: new Date('2026-12-31'),
                isActive: true,
                usageLimit: 100
            },
            {
                code: 'FIXED500',
                discountType: 'Fixed',
                discountValue: 500,
                expiryDate: new Date('2026-12-31'),
                isActive: true,
                usageLimit: 100
            }
        ];

        for (const coupon of coupons) {
            await Coupon.findOneAndUpdate(
                { code: coupon.code },
                coupon,
                { upsert: true }
            );
        }

        return NextResponse.json({ success: true, message: 'Test coupons created: SAVE10, FIXED500' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
