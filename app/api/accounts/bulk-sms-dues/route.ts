import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';
import SiteSettings from '@/models/SiteSettings';
import { sendSMS } from '@/lib/sms';

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        // 1. Fetch Students with search/filter criteria if provided, or just all with dues
        // For simplicity and "smart" approach, we fetch all students with dues
        const studentsWithDues = await Student.find({ dueAmount: { $gt: 0 } });

        if (studentsWithDues.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No students found with outstanding dues.'
            }, { status: 404 });
        }

        // 2. Fetch SMS Template
        const settings = await SiteSettings.findOne();
        const template = settings?.smsTemplates?.paymentDue || 'Hi [NAME], this is a reminder regarding your pending payment. Please settle it soon.';

        // 3. Send SMS to each student
        const results = {
            total: studentsWithDues.length,
            success: 0,
            failed: 0,
            errors: [] as string[]
        };

        // We use Promise.allSettled to handle multiple requests, but one by one or in small batches might be safer for API limits.
        // For now, let's do it sequentially to avoid hitting rate limits if the API has any, and to be "smart" about logging.
        for (const student of studentsWithDues) {
            if (!student.mobileNo) {
                results.failed++;
                results.errors.push(`Student ${student.fullName} has no mobile number.`);
                continue;
            }

            const message = template
                .replace(/\[NAME\]/g, student.fullName)
                .replace(/\[AMOUNT\]/g, student.dueAmount.toString());
            
            try {
                const response = await sendSMS(student.mobileNo, message);
                if (response.success) {
                    results.success++;
                } else {
                    results.failed++;
                    results.errors.push(`Failed to send to ${student.fullName}: ${response.message}`);
                }
            } catch (err: any) {
                results.failed++;
                results.errors.push(`Error sending to ${student.fullName}: ${err.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Batch SMS process completed.`,
            data: results
        });

    } catch (error: any) {
        console.error("Bulk SMS Error:", error);
        return NextResponse.json({
            success: false,
            message: error.message || 'An error occurred during the bulk SMS process.'
        }, { status: 500 });
    }
}
