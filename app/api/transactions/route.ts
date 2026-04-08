import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Student from '@/models/Student';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const status = searchParams.get('status');
        const email = searchParams.get('email');
        const userId = searchParams.get('userId');

        const filter: any = {};
        if (type) filter.type = type;
        if (status) filter.status = status;
        if (userId) filter.user = userId;
        
        // Filter by email in metadata or user record
        if (email) {
            filter.$or = [
                { 'metadata.email': email },
                { 'senderNumber': email } // Fallback for some systems using phone/email in senderNumber
            ];
        }

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

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
            return unauthorizedResponse();
        }

        const { amount, email, courseName, method, description } = await req.json();

        if (!amount || !email || !courseName) {
            return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // 1. Find the student
        const student = await Student.findOne({ email, courseName });
        if (!student) {
            return NextResponse.json({ success: false, message: 'Student not found for this course' }, { status: 404 });
        }

        // 2. Create the manual transaction
        const transactionId = `MAN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const transaction = await Transaction.create({
            type: 'manual_payment',
            amount: Number(amount),
            status: 'completed',
            method: method || 'Cash',
            transactionId: transactionId,
            description: description || `Manual payment recorded by ${user.name}`,
            processedBy: user.name,
            metadata: {
                email,
                courseName,
                fullName: student.fullName
            }
        });

        // 3. Update student record
        student.paidAmount += Number(amount);
        student.dueAmount = Math.max(0, student.totalCourseFee - student.paidAmount);
        await student.save();

        return NextResponse.json({
            success: true,
            message: 'Payment recorded successfully',
            data: transaction
        }, { status: 201 });

    } catch (error: any) {
        console.error('Manual Transaction Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to record manual payment' },
            { status: 500 }
        );
    }
}
