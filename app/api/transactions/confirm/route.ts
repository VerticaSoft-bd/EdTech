import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Student from '@/models/Student';
import User from '@/models/User';
import { getAuthenticatedUser, unauthorizedResponse } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthenticatedUser(req);
        if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
            return unauthorizedResponse();
        }

        const { transactionId } = await req.json();
        if (!transactionId) {
            return NextResponse.json({ success: false, message: 'Transaction ID is required' }, { status: 400 });
        }

        await dbConnect();

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
        }

        if (transaction.status !== 'pending') {
            return NextResponse.json({ success: false, message: 'Transaction is not pending' }, { status: 400 });
        }

        // Update Transaction
        transaction.status = 'completed';
        transaction.processedBy = user.name;
        if (!transaction.description || transaction.description === '') {
            transaction.description = `Confirmed by ${user.name}`;
        }
        await transaction.save();

        // Update Student if it's a course purchase or manual payment
        if (transaction.type === 'course_purchase' || transaction.type === 'manual_payment') {
            const { courseName, email } = transaction.metadata || {};
            if (courseName && email) {
                const student = await Student.findOne({ email, courseName });
                if (student) {
                    const newPaidAmount = Number(((student.paidAmount || 0) + transaction.amount).toFixed(2));
                    const newDueAmount = Math.max(0, Number(((student.totalCourseFee || 0) - newPaidAmount).toFixed(2)));

                    await Student.findOneAndUpdate(
                        { email, courseName },
                        {
                            paidAmount: newPaidAmount,
                            dueAmount: newDueAmount
                        }
                    );
                }
            }
        } else if (transaction.type === 'deposit') {
            // Update User Balance if it's a deposit
            if (transaction.user) {
                await User.findByIdAndUpdate(transaction.user, {
                    $inc: { depositBalance: transaction.amount }
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Payment confirmed successfully',
            data: transaction
        });

    } catch (error: any) {
        console.error('Confirm Transaction Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to confirm payment' },
            { status: 500 }
        );
    }
}
