import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/db';
import VisitorStat from '@/models/VisitorStat';
import { jwtVerify } from 'jose';

export async function GET(req: NextRequest) {
    try {
        const authCookie = req.cookies.get('token');
        if (!authCookie) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
        const { payload } = await jwtVerify(authCookie.value, secret);

        if (payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await connectMongo();

        const url = new URL(req.url);
        const reqMonth = url.searchParams.get('month');
        const reqYear = url.searchParams.get('year');

        const now = new Date();
        const targetYear = reqYear ? parseInt(reqYear, 10) : now.getFullYear();
        const targetMonth = reqMonth ? parseInt(reqMonth, 10) : now.getMonth() + 1; // 1-12

        // Today's Stats
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        
        const todayStr = `${startOfToday.getFullYear()}-${String(startOfToday.getMonth() + 1).padStart(2, '0')}-${String(startOfToday.getDate()).padStart(2, '0')}`;
        const yesterdayStr = `${startOfYesterday.getFullYear()}-${String(startOfYesterday.getMonth() + 1).padStart(2, '0')}-${String(startOfYesterday.getDate()).padStart(2, '0')}`;

        // Fetch All metrics
        const [allTimeData, monthlyData, todayData, yesterdayData] = await Promise.all([
            VisitorStat.aggregate([{ $group: { _id: null, total: { $sum: "$count" } } }]),
            VisitorStat.find({ year: targetYear, month: targetMonth }).sort({ date: 1 }),
            VisitorStat.findOne({ date: todayStr }),
            VisitorStat.findOne({ date: yesterdayStr })
        ]);

        const allTimeTotal = allTimeData.length > 0 ? allTimeData[0].total : 0;
        const todayRequests = todayData ? todayData.count : 0;
        const yesterdayRequests = yesterdayData ? yesterdayData.count : 0;

        let percentageChange = 0;
        if (yesterdayRequests > 0) {
            percentageChange = Math.round(((todayRequests - yesterdayRequests) / yesterdayRequests) * 100);
        } else if (todayRequests > 0) {
            percentageChange = 100;
        }

        // Format daily data for the selected month to show on the chart
        const totalDaysInMonth = new Date(targetYear, targetMonth, 0).getDate();
        const chartData = [];
        
        for (let day = 1; day <= totalDaysInMonth; day++) {
             const manualDateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
             const found = monthlyData.find((d: any) => d.date === manualDateStr);
             const dateObj = new Date(targetYear, targetMonth - 1, day);
             
             chartData.push({
                 date: day.toString(),
                 fullDate: dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                 count: found ? found.count : 0
             });
        }

        return NextResponse.json({
            success: true,
            data: {
                today: todayRequests,
                percentageChange: percentageChange >= 0 ? `+${percentageChange}%` : `${percentageChange}%`,
                allTimeTotal: allTimeTotal,
                chartData
            }
        });

    } catch (error) {
        console.error('API Error /api/admin/analytics/requests:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
