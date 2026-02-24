import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
    name: string;
    description?: string;
    status: 'Active' | 'Inactive';
    membersCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const GroupSchema: Schema<IGroup> = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a group name'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    membersCount: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

export default mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);
