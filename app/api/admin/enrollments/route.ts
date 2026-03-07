import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Student from '@/models/Student';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '0');
        const page = parseInt(searchParams.get('page') || '1');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';

        const filter: any = { type: 'course_purchase' };
        if (status) filter.status = status;

        let query = Transaction.find(filter)
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 })
            .lean();

        // Get total count for pagination
        const total = await Transaction.countDocuments(filter);

        if (limit > 0 && !searchParams.get('page')) {
            // Simple limit mode (for dashboard widget)
            query = query.limit(limit);
        } else if (limit > 0) {
            // Pagination mode
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
        }

        let enrollments = await query;

        // Server-side search filter on populated fields
        if (search) {
            const searchLower = search.toLowerCase();
            enrollments = enrollments.filter((e: any) => {
                const userName = (e.user as any)?.name?.toLowerCase() || '';
                const userEmail = (e.user as any)?.email?.toLowerCase() || '';
                const courseName = e.metadata?.courseName?.toLowerCase() || '';
                return userName.includes(searchLower) ||
                    userEmail.includes(searchLower) ||
                    courseName.includes(searchLower);
            });
        }

        // Attach Student payment data (totalCourseFee, paidAmount, dueAmount)
        const enrichedEnrollments = await Promise.all(
            enrollments.map(async (e: any) => {
                const email = e.metadata?.email || (e.user as any)?.email;
                const courseName = e.metadata?.courseName;
                if (email && courseName) {
                    const student = await Student.findOne({ email, courseName })
                        .select('totalCourseFee paidAmount dueAmount')
                        .lean();
                    return { ...e, studentPayment: student || null };
                }
                return { ...e, studentPayment: null };
            })
        );

        return NextResponse.json({
            success: true,
            data: enrichedEnrollments,
            total,
            page,
            totalPages: limit > 0 ? Math.ceil(total / limit) : 1,
        });
    } catch (error: any) {
        console.error('Admin Enrollments Fetch Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch enrollments' },
            { status: 500 }
        );
    }
}
