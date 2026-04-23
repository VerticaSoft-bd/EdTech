import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';
import Employee from '@/models/Employee';
import Expense from '@/models/Expense';
import Transaction from '@/models/Transaction';

export async function GET() {
    try {
        await connectToDatabase();

        // Current month boundaries
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        // Fetch students
        const students = await Student.find({});

        // Student financials
        const totalCollected = students.reduce((acc, s) => acc + (s.paidAmount || 0), 0);
        const totalDue = students.reduce((acc, s) => acc + (s.dueAmount || 0), 0);
        
        // Fix: Total Receivable should be the sum of what's collected and what's still due
        const totalReceivable = totalCollected + totalDue;

        // Fix: Calculate monthly collection from transactions for a proper monthly net balance
        const monthlyTransactions = await Transaction.find({
            status: 'completed',
            type: { $in: ['course_purchase', 'manual_payment'] },
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });
        const monthlyCollected = monthlyTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);

        // Employee / Payroll
        const activeEmployees = await Employee.find({ status: 'active' });
        const totalEmployees = activeEmployees.length;
        const totalPayroll = activeEmployees.reduce((acc, e) => acc + (e.monthlySalary || 0), 0);

        // Expenses this month
        // Fix: Exclude 'Payroll' category from general expenses to avoid double counting with totalPayroll
        const monthlyExpenses = await Expense.find({
            type: 'monthly',
            date: { $gte: startOfMonth, $lte: endOfMonth },
            category: { $ne: 'Payroll' }
        });
        const totalMonthlyExpenses = monthlyExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

        const dailyExpenses = await Expense.find({
            type: 'daily',
            date: { $gte: startOfMonth, $lte: endOfMonth },
            category: { $ne: 'Payroll' }
        });
        const totalDailyExpenses = dailyExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

        // All-time totals
        const allExpenses = await Expense.find({});
        const totalAllExpenses = allExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

        // Net balance = monthly collected - total payroll - total expenses (this month)
        const netBalance = monthlyCollected - totalPayroll - totalMonthlyExpenses - totalDailyExpenses;

        return NextResponse.json({
            success: true,
            data: {
                students: {
                    totalReceivable,
                    totalCollected,
                    totalDue,
                    count: students.length,
                    monthlyCollected
                },
                payroll: {
                    totalEmployees,
                    totalPayroll,
                },
                expenses: {
                    dailyThisMonth: totalDailyExpenses,
                    monthlyThisMonth: totalMonthlyExpenses,
                    totalThisMonth: totalDailyExpenses + totalMonthlyExpenses,
                    totalAllTime: totalAllExpenses,
                },
                netBalance,
                currentMonth: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
            },
        });
    } catch (error: any) {
        console.error('Accounts Summary Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to fetch accounts summary' },
            { status: 500 }
        );
    }
}
