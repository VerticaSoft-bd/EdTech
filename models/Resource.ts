import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IResource extends Document {
    courseId: mongoose.Types.ObjectId;
    moduleId: string;
    title: string;
    description?: string;
    type: 'Text' | 'Link';
    url: string;
    isPublished: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const ResourceSchema: Schema<IResource> = new Schema(
    {
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        moduleId: { type: String, required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String },
        type: {
            type: String,
            enum: ['Text', 'Link'],
            required: true,
        },
        url: { type: String, required: true },
        isPublished: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Index for faster lookups
ResourceSchema.index({ courseId: 1, moduleId: 1 });

if (mongoose.models.Resource) {
    delete mongoose.models.Resource;
}

const Resource: Model<IResource> = mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;
