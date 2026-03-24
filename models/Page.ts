import mongoose, { Document, Model } from 'mongoose';

export interface IPage extends Document {
    slug: string;
    title: string;
    content: string;
}

const PageSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        default: '',
    },
}, { timestamps: true });

if (mongoose.models.Page) {
    delete mongoose.models.Page;
}

const Page: Model<IPage> = mongoose.model<IPage>('Page', PageSchema);

export default Page;
