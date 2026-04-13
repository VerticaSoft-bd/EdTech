import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBatch extends Document {
    name: string;
    type: 'Online Batch' | 'Offline Batch';
    schedule: string;
    timing: string;
    teachers: mongoose.Types.ObjectId[];
    totalSeats: number;
    enrolledStudents: number;
    startDate: string;
    status: 'Active' | 'Archived';
    createdAt: Date;
    updatedAt: Date;
}

const BatchSchema: Schema<IBatch> = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String, enum: ['Online Batch', 'Offline Batch'], required: true },
        schedule: { type: String, required: true },
        timing: { type: String, required: true },
        teachers: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            default: []
        },
        totalSeats: { type: Number, required: true, default: 0 },
        enrolledStudents: { type: Number, default: 0 },
        startDate: { type: String, required: true },
        status: { type: String, enum: ['Active', 'Archived'], default: 'Active' },
    },
    { timestamps: true }
);

if (mongoose.models.Batch) {
    delete mongoose.models.Batch;
}

const Batch: Model<IBatch> = mongoose.models.Batch || mongoose.model<IBatch>('Batch', BatchSchema);

export default Batch;
