import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        await connectToDatabase();

        // Find instructor by slug (using the new slug field)
        // Fallback to find by ID if slug doesn't match and it's a valid ObjectId
        let user;
        if (slug.length === 24 && /^[0-9a-fA-F]+$/.test(slug)) {
            user = await User.findById(slug).select('-password -email -staffPermissions -mobileNo -presentAddress -fatherName -motherName -guardianMobileNo -nidNo').lean();
        } else {
            user = await User.findOne({ slug }).select('-password -email -staffPermissions -mobileNo -presentAddress -fatherName -motherName -guardianMobileNo -nidNo').lean();
        }

        if (!user || user.role !== 'teacher') {
            return NextResponse.json({ success: false, message: 'Instructor not found' }, { status: 404 });
        }

        // Fetch courses for this instructor
        const courses = await Course.find({ 
            assignedTeachers: user._id,
            status: 'Active' 
        }).select('title slug subtitle thumbnail regularFee discountPercentage duration courseMode totalStudents').sort({ createdAt: -1 });

        return NextResponse.json({ 
            success: true, 
            data: {
                ...user,
                courses
            }
        });
    } catch (error: any) {
        console.error("Get Instructor Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Error fetching instructor' }, { status: 500 });
    }
}
