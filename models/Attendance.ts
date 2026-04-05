import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAttendance extends Document {
    student: mongoose.Types.ObjectId;
    studentEmail: string;
    courseName: string;
    date: Date;
    status: 'Present' | 'Absent' | 'Late';
    markedBy: mongoose.Types.ObjectId;
    method: 'Manual' | 'Self';
    deviceInfo?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const AttendanceSchema: Schema<IAttendance> = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        studentEmail: {
            type: String,
            required: true,
            index: true,
        },
        courseName: {
            type: String,
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late'],
            default: 'Present',
            required: true,
        },
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        method: {
            type: String,
            enum: ['Manual', 'Self'],
            default: 'Manual',
        },
        deviceInfo: {
            type: Schema.Types.Mixed,
        }
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate attendance for the same student on the same course and date
AttendanceSchema.index({ student: 1, courseName: 1, date: 1 }, { unique: true });

// Clear schema cache for Next.js hot reload
if (mongoose.models.Attendance) {
    delete mongoose.models.Attendance;
}

const Attendance: Model<IAttendance> = mongoose.model<IAttendance>('Attendance', AttendanceSchema);

export default Attendance;
