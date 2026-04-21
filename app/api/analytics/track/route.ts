import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/db';
import VisitorStat from '@/models/VisitorStat';

export async function POST(req: NextRequest) {
    try {
        await connectMongo();

        // We only need local date to increment today's counter correctly
        const today = new Date();
        // Shift to local time if needed, but UTC is usually fine for daily stats
        const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        await VisitorStat.findOneAndUpdate(
            { date: dateStr },
            { 
                $inc: { count: 1 },
                $setOnInsert: { 
                    year: today.getFullYear(), 
                    month: today.getMonth() + 1 
                } 
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error('Failed to log web request:', error);
        return NextResponse.json({ success: false, error: 'Failed to log tracking data' }, { status: 500 });
    }
}
