import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IHeroSlide extends Document {
    tag: string;
    title: string;
    highlight: string;
    description: string;
    primaryBtn: string;
    secondaryBtn: string;
    image: string;
    color: string;
    order: number;
    isActive: boolean;
}

const HeroSlideSchema: Schema<IHeroSlide> = new Schema({
    tag: { type: String, required: true },
    title: { type: String, required: true },
    highlight: { type: String, required: true },
    description: { type: String, required: true },
    primaryBtn: { type: String, required: true },
    secondaryBtn: { type: String, required: true },
    image: { type: String, required: true },
    color: { type: String, default: '#6C5DD3' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const HeroSlide: Model<IHeroSlide> = mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);

export default HeroSlide;
