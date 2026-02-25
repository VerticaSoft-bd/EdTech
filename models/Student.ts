import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStudent extends Document {
    courseName: string;
    fullName: string;
    fatherName: string;
    motherName: string;
    residentialStatus: 'Resident' | 'Non-Resident';
    maritalStatus: 'Single' | 'Married' | 'Others';
    gender: 'Male' | 'Female';
    dateOfBirth: string; // or Date Native
    presentAddress: string;
    zipCode: string;
    city: string;
    country: string;
    email: string;
    nidNo: string;
    education: string;
    mobileNo: string;
    guardianMobileNo: string;
    privacyPolicyAccepted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const StudentSchema: Schema<IStudent> = new mongoose.Schema(
    {
        courseName: { type: String, required: true },
        fullName: { type: String, required: true },
        fatherName: { type: String, required: true },
        motherName: { type: String, required: true },
        residentialStatus: {
            type: String,
            enum: ['Resident', 'Non-Resident'],
            required: true
        },
        maritalStatus: {
            type: String,
            enum: ['Single', 'Married', 'Others'],
            required: true
        },
        gender: {
            type: String,
            enum: ['Male', 'Female'],
            required: true
        },
        dateOfBirth: { type: String, required: true },
        presentAddress: { type: String, required: true },
        zipCode: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        nidNo: { type: String, required: true },
        education: { type: String, required: true },
        mobileNo: { type: String, required: true },
        guardianMobileNo: { type: String, required: true },
        privacyPolicyAccepted: { type: Boolean, required: true, default: false },
    },
    {
        timestamps: true,
    }
);

// Prevent mongoose from compiling the model multiple times
const Student: Model<IStudent> =
    mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
