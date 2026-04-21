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
        totalCourseFee: { type: Number, required: true },
        paidAmount: { type: Number, required: true },
        dueAmount: { type: Number, required: true },
        country: { type: String, required: true },
        email: { type: String, required: true },
        nidNo: { type: String, required: true },
        education: { type: String, required: true },
        mobileNo: { type: String, required: true },
        guardianMobileNo: { type: String, required: true },
        avatar: { type: String },
        appliedCoupon: { type: String },
        discountAmount: { type: Number, default: 0 },
        privacyPolicyAccepted: { type: Boolean, required: true, default: false },
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

// Clear Mongoose schema cache for hot-reloading in Next.js
if (mongoose.models.Student) {
    delete mongoose.models.Student;
}

const Student: Model<IStudent> = mongoose.model<IStudent>('Student', StudentSchema);

// Sync indexes only when needed, not on every import which can cause timeouts if DB is not connected
// Student.syncIndexes().catch((err) => {
//     console.error('Error syncing Student indexes:', err);
// });

export default Student;
