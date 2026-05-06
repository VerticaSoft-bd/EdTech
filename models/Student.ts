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
    totalCourseFee: number;
    paidAmount: number;
    dueAmount: number;
    country: string;
    email: string;
    nidNo: string;
    education: string;
    mobileNo: string;
    guardianMobileNo: string;
    avatar?: string;
    appliedCoupon?: string;
    discountAmount?: number;
    privacyPolicyAccepted: boolean;
    progress: number;
    totalClasses: number;
    attendedClasses: number;
    courseMode: 'Online' | 'Offline' | 'Online Class' | 'Offline Class' | 'Hybrid';
    batchId?: mongoose.Types.ObjectId[];
    completedModuleIds: string[];
    createdAt: Date;
    updatedAt: Date;
}

const StudentSchema: Schema<IStudent> = new mongoose.Schema(
    {
        courseName: { type: String, required: true },
        fullName: { type: String, required: true },
        fatherName: { type: String, required: false },
        motherName: { type: String, required: false },
        residentialStatus: {
            type: String,
            enum: ['Resident', 'Non-Resident'],
            required: false
        },
        maritalStatus: {
            type: String,
            enum: ['Single', 'Married', 'Others'],
            required: false
        },
        gender: {
            type: String,
            enum: ['Male', 'Female'],
            required: false
        },
        dateOfBirth: { type: String, required: false },
        presentAddress: { type: String, required: false },
        totalCourseFee: { type: Number, required: true },
        paidAmount: { type: Number, required: true },
        dueAmount: { type: Number, required: true },
        country: { type: String, required: false },
        email: { type: String, required: false },
        nidNo: { type: String, required: false },
        education: { type: String, required: false },
        mobileNo: { type: String, required: true },
        guardianMobileNo: { type: String, required: false },
        avatar: { type: String },
        appliedCoupon: { type: String },
        discountAmount: { type: Number, default: 0 },
        privacyPolicyAccepted: { type: Boolean, required: false, default: false },
        progress: { type: Number, default: 0 },
        totalClasses: { type: Number, default: 0 },
        attendedClasses: { type: Number, default: 0 },
        courseMode: { type: String, enum: ['Online', 'Offline', 'Online Class', 'Offline Class', 'Hybrid'], default: 'Online' },
        batchId: { type: [Schema.Types.ObjectId], ref: 'Batch' },
        completedModuleIds: { type: [String], default: [] },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate enrollment in the same course
StudentSchema.index({ email: 1, courseName: 1 }, { unique: true });

const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
