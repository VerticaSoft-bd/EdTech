import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Student from '@/models/Student';
import Course from '@/models/Course';
import Coupon from '@/models/Coupon';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import SiteSettings from '@/models/SiteSettings';
import { sendSMS } from '@/lib/sms';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Ensure critical fields exist
        // Ensure critical fields exist
        if (!body.fullName || !body.mobileNo || !body.courseName) {
            return NextResponse.json(
                { success: false, message: 'Please provide required fields: Full Name, Mobile No, and Course Name' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Fetch course details to get courseMode
        const courseData = await Course.findOne({ title: body.courseName });
        const courseMode = courseData?.courseMode || 'Online';

        // Check if student is already enrolled in this specific course
        // Check if student is already enrolled in this specific course
        let existingEnrollment = null;
        if (body.email) {
            existingEnrollment = await Student.findOne({ email: body.email, courseName: body.courseName });
        } else {
            existingEnrollment = await Student.findOne({ mobileNo: body.mobileNo, courseName: body.courseName });
        }

        if (existingEnrollment) {
            return NextResponse.json(
                { success: false, message: 'Student is already enrolled in this course' },
                { status: 400 }
            );
        }

        const paidAmount = Number(body.paidAmount || 0);
        const totalCourseFee = Number(body.totalCourseFee || 0);
        const dueAmount = Math.max(0, Number((totalCourseFee - paidAmount).toFixed(2)));

        const newStudent = await Student.create({
            ...body,
            paidAmount,
            totalCourseFee,
            dueAmount,
            courseMode
        });

        let transactionId = null;
        // Create initial transaction if a deposit was made
        if (paidAmount > 0) {
            transactionId = `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
            await Transaction.create({
                type: 'course_purchase',
                amount: paidAmount,
                status: 'completed',
                method: body.paymentMethod || 'Cash',
                transactionId: transactionId,
                description: `Initial deposit for ${body.courseName}`,
                metadata: {
                    email: body.email,
                    courseName: body.courseName,
                    fullName: body.fullName
                }
            });
        }

        // If coupon applied, increment usageCount
        if (body.appliedCoupon) {
            await Coupon.findOneAndUpdate(
                { code: body.appliedCoupon.toUpperCase() },
                { $inc: { usageCount: 1 } }
            );
        }

        // --- SMART ONBOARDING LOGIC ---
        // 1. Create or Find User account
        let user = null;
        if (body.email) {
            user = await User.findOne({ email: body.email });
        } else {
            user = await User.findOne({ mobileNo: body.mobileNo });
        }
        
        const isNewUser = !user;

        if (!user) {
            user = await User.create({
                name: body.fullName,
                email: body.email || undefined,
                password: crypto.randomBytes(16).toString('hex'), // Random temp password
                role: 'student',
                mobileNo: body.mobileNo,
                needsPasswordSetup: true
            });
        }

        // 2. If Offline Student, generate magic token and send SMS
        const normalizedMode = (courseMode || '').toLowerCase();
        const isOffline = normalizedMode.includes('offline');

        console.log(`[Onboarding] Flow triggered for student: ${body.fullName}`);
        console.log(`[Onboarding] Course: ${body.courseName}, Detected Mode: ${courseMode}, IsOffline: ${isOffline}`);

        if (isOffline) {
            console.log(`[Onboarding] Generating magic link for ${body.fullName}...`);
            const magicToken = crypto.randomBytes(8).toString('hex');
            user.magicLoginToken = magicToken;
            user.magicLoginTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            await user.save();

            // 3. Fetch SMS Template
            const settings = await SiteSettings.findOne().lean();
            const template = (settings as any)?.smsTemplates?.offlineStudentSignup || 
                             (settings as any)?.smsTemplates?.['offlineStudentSignup'] ||
                             "[NAME], setup your password [LINK] - YouthINS";
            
            const origin = new URL(request.url).origin;
            const appUrl = (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) 
                ? process.env.NEXT_PUBLIC_APP_URL 
                : origin;
            const magicLink = `${appUrl}/l/${magicToken}`;

            const smsMessage = template
                .replace(/\[NAME\]/g, body.fullName)
                .replace(/\[COURSE\]/g, body.courseName)
                .replace(/\[LINK\]/g, magicLink);

            console.log(`[Onboarding] Sending SMS to ${body.mobileNo}...`);
            const smsResult = await sendSMS(body.mobileNo, smsMessage);
            
            if (smsResult.success) {
                console.log(`[Onboarding] SMS sent successfully to ${body.fullName}`);
            } else {
                console.error(`[Onboarding] SMS Failed: ${smsResult.message}`);
            }
        } else {
            console.log(`[Onboarding] Skipping SMS link as student is not offline.`);
        }
        // --- END SMART ONBOARDING LOGIC ---

        return NextResponse.json({
            success: true,
            message: 'Student created successfully',
            data: newStudent,
            invoiceId: transactionId
        }, { status: 201 });

    } catch (error: any) {
        console.error("Create Student Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred during student registration' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        await connectToDatabase();

        const url = new URL(request.url);
        const batchId = url.searchParams.get('batchId');
        const email = url.searchParams.get('email');

        // Determine user role and ID
        const { cookies } = await import('next/headers');
        const { jwtVerify } = await import('jose');
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        let userRole = '';
        let userId = null;

        if (token) {
            try {
                const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
                const { payload } = await jwtVerify(token, secret);
                userRole = payload.role as string;
                userId = payload.id;
            } catch (err) {
                // Ignore token errors
            }
        }

        let query: any = {};
        
        if (batchId) {
            query.batchId = batchId;
        }

        if (email) {
            query.email = email;
        }

        // If teacher, only show students from their assigned batches
        if (userRole === 'teacher' && userId) {
            const Batch = (await import('@/models/Batch')).default;
            const teacherBatches = await Batch.find({ teachers: userId }).select('_id');
            const batchIds = teacherBatches.map(b => b._id);
            
            if (batchId) {
                // If a specific batchId was requested, ensure it belongs to the teacher
                if (!batchIds.some(id => id.toString() === batchId)) {
                    return NextResponse.json({ success: true, data: [] });
                }
            } else {
                query.batchId = { $in: batchIds };
            }
        } else if (userRole === 'student' && userId) {
            // Students can only see themselves (or maybe nothing from this list)
            query.email = (await import('@/models/User')).default.findById(userId).then(u => u?.email);
        }

        const students = await Student.find(query).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: students
        });
    } catch (error: any) {
        console.error("Fetch Students Error:", error);
        return NextResponse.json(
            { success: false, message: error.message || 'An error occurred while fetching students' },
            { status: 500 }
        );
    }
}
