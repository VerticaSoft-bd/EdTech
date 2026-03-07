import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');

        const filter: any = {};
        if (type) filter.type = type;
        if (status) filter.status = status;

        const transactions = await Transaction.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: transactions,
        });
    } catch (error: any) {
        console.error('Transactions Fetch Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
}
