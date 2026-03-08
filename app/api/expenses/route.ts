import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Expense from '@/models/Expense';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // daily | monthly
        const month = searchParams.get('month'); // YYYY-MM
        const category = searchParams.get('category');

        await connectToDatabase();

        const query: any = {};
        if (type) query.type = type;
        if (category) query.category = category;

        if (month) {
            const [year, mon] = month.split('-').map(Number);
            const startDate = new Date(year, mon - 1, 1);
            const endDate = new Date(year, mon, 0, 23, 59, 59, 999);
            query.date = { $gte: startDate, $lte: endDate };
        }

        const expenses = await Expense.find(query).sort({ date: -1, createdAt: -1 });

        // Calculate total
        const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

        return NextResponse.json({ success: true, data: expenses, total });
    } catch (error: any) {
        console.error('Fetch Expenses Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to fetch expenses' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, amount, category, type, date, notes, paidBy } = body;

        if (!title || amount === undefined || !type) {
            return NextResponse.json(
                { success: false, message: 'Title, amount, and type are required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const expense = await Expense.create({
            title,
            amount,
            category: category || 'Other',
            type,
            date: date || new Date(),
            notes,
            paidBy,
        });

        return NextResponse.json(
            { success: true, message: 'Expense added successfully', data: expense },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create Expense Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to create expense' },
            { status: 500 }
        );
    }
}
