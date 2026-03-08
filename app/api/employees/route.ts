import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Employee from '@/models/Employee';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');

        await connectToDatabase();

        const query: any = {};
        if (status) query.status = status;
        if (type) query.employeeType = type;

        const employees = await Employee.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: employees });
    } catch (error: any) {
        console.error('Fetch Employees Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to fetch employees' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, department, designation, monthlySalary, joinDate, status, employeeType, notes } = body;

        if (!name || monthlySalary === undefined) {
            return NextResponse.json(
                { success: false, message: 'Name and monthly salary are required' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const employee = await Employee.create({
            name,
            email,
            phone,
            department,
            designation,
            monthlySalary,
            joinDate: joinDate || new Date(),
            status: status || 'active',
            employeeType: employeeType || 'staff',
            notes,
        });

        return NextResponse.json(
            { success: true, message: 'Employee created successfully', data: employee },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create Employee Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Failed to create employee' },
            { status: 500 }
        );
    }
}
