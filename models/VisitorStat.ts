import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitorStat extends Document {
    date: string; // Format: YYYY-MM-DD
    count: number;
    year: number;
    month: number;
}

const visitorStatSchema = new Schema<IVisitorStat>({
    date: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
});

const VisitorStat = mongoose.models.VisitorStat || mongoose.model<IVisitorStat>('VisitorStat', visitorStatSchema);

export default VisitorStat;
