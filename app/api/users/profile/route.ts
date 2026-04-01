import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Student from '@/models/Student';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const userSession = await getAuthenticatedUser();
        if (!userSession) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        
        const user = await User.findOne({ email: userSession.email }).select('-password').lean();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch latest student record for additional info like mobile number and address
        const student = await Student.findOne({ email: userSession.email }).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ user, student });
    } catch (error: any) {
        console.error("Error fetching profile api:", error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const userSession = await getAuthenticatedUser();
        if (!userSession) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { 
            name, 
            password, 
            currentPassword,
            mobileNo, 
            presentAddress,
            fatherName,
            motherName,
            guardianMobileNo,
            dateOfBirth,
            nidNo,
            gender,
            maritalStatus,
            residentialStatus,
            country,
            education
        } = body;

        await dbConnect();

        // Fetch user with password for verification
        const user = await User.findOne({ email: userSession.email }).select('+password');
        if (!user) {
             return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Handle security: If password change is requested, verify current password
        if (password) {
            if (!currentPassword) {
                return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
            }
            
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return NextResponse.json({ error: 'Current password does not match' }, { status: 401 });
            }
            
            user.password = password; 
        }

        // Update other User details
        if (name) user.name = name;

        await user.save();

        // Update all Student Models associated with this user
        const updateData: any = {};
        if (name) updateData.fullName = name;
        if (mobileNo !== undefined) updateData.mobileNo = mobileNo;
        if (presentAddress !== undefined) updateData.presentAddress = presentAddress;
        if (fatherName !== undefined) updateData.fatherName = fatherName;
        if (motherName !== undefined) updateData.motherName = motherName;
        if (guardianMobileNo !== undefined) updateData.guardianMobileNo = guardianMobileNo;
        if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
        if (nidNo !== undefined) updateData.nidNo = nidNo;
        if (gender !== undefined) updateData.gender = gender;
        if (maritalStatus !== undefined) updateData.maritalStatus = maritalStatus;
        if (residentialStatus !== undefined) updateData.residentialStatus = residentialStatus;
        if (country !== undefined) updateData.country = country;
        if (education !== undefined) updateData.education = education;
        
        if (Object.keys(updateData).length > 0) {
             await Student.updateMany({ email: userSession.email }, { $set: updateData });
        }

        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (error: any) {
        console.error("Error updating profile api:", error);
         return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
