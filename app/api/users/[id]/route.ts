import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { deleteFromS3 } from '@/lib/s3-client';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectToDatabase();
        
        const user = await User.findById(id).select('-password').lean();
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        console.error("Get User Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Error fetching user' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        
        await connectToDatabase();

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        
        const updateData: any = {};
        if (body.name) updateData.name = body.name;
        if (body.email) updateData.email = body.email;
        if (body.role) updateData.role = body.role;
        if (body.staffPermissions !== undefined) updateData.staffPermissions = body.staffPermissions;

        // Profile fields
        if (body.mobileNo !== undefined) updateData.mobileNo = body.mobileNo;
        if (body.presentAddress !== undefined) updateData.presentAddress = body.presentAddress;
        if (body.fatherName !== undefined) updateData.fatherName = body.fatherName;
        if (body.motherName !== undefined) updateData.motherName = body.motherName;
        if (body.guardianMobileNo !== undefined) updateData.guardianMobileNo = body.guardianMobileNo;
        if (body.dateOfBirth !== undefined) updateData.dateOfBirth = body.dateOfBirth;
        if (body.nidNo !== undefined) updateData.nidNo = body.nidNo;
        if (body.gender !== undefined) updateData.gender = body.gender;
        if (body.maritalStatus !== undefined) updateData.maritalStatus = body.maritalStatus;
        if (body.residentialStatus !== undefined) updateData.residentialStatus = body.residentialStatus;
        if (body.country !== undefined) updateData.country = body.country;
        if (body.education !== undefined) updateData.education = body.education;
        if (body.designation !== undefined) updateData.designation = body.designation;
        if (body.bio !== undefined) updateData.bio = body.bio;
        
        // Handle profile image update
        if (body.image !== undefined) {
            if (existingUser.image && existingUser.image !== body.image) {
                await deleteFromS3(existingUser.image);
            }
            updateData.image = body.image;
        }

        if (body.expertise !== undefined) updateData.expertise = Array.isArray(body.expertise) ? body.expertise : (typeof body.expertise === 'string' ? body.expertise.split(',').map((s: string) => s.trim()) : []);
        
        const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
        
        return NextResponse.json({ success: true, message: 'User updated successfully', data: user });
    } catch (error: any) {
        console.error("Update User Error:", error);
        return NextResponse.json({ success: false, message: error.message || 'Error updating user' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await connectToDatabase();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Cleanup profile image
        if (user.image) {
            await deleteFromS3(user.image);
        }

        // Smart Approach: If deleting a student user, also delete their Student enrollment record
        if (user.role === 'student') {
            const Student = (await import('@/models/Student')).default;
            const studentRecord = await Student.findOne({ email: user.email });
            if (studentRecord) {
                // Delete avatar if different from user image
                if (studentRecord.avatar && studentRecord.avatar !== user.image) {
                    await deleteFromS3(studentRecord.avatar);
                }
                
                // Cleanup attendance
                const Attendance = (await import('@/models/Attendance')).default;
                await Attendance.deleteMany({ student: studentRecord._id });
                
                // Delete student record
                await Student.findByIdAndDelete(studentRecord._id);
            }
        }

        await User.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'User and related records deleted successfully' });
    } catch (error: any) {
        console.error("Delete User Error:", error);
        return NextResponse.json({ success: false, message: 'Failed to delete user' }, { status: 500 });
    }
}
