import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    description: string;
    status: 'Active' | 'Draft' | 'Inactive';
    color: string;
    thumbnail: string;
}

const CategorySchema: Schema<ICategory> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Draft', 'Inactive'],
        default: 'Active',
    },
    color: {
        type: String,
        default: 'from-[#8E8AFF] to-[#B4B1FF]',
    },
    thumbnail: {
        type: String,
        default: '',
    }
}, { timestamps: true });

// Check if the model already exists before creating a new one
const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
