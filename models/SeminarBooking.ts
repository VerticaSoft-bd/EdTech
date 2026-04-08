import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISeminarBooking extends Document {
    name: string;
    email: string;
    phone: string;
    profession: string;
    courseTitle?: string;
    status: string;
    createdAt: Date;
}

const SeminarBookingSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profession: { type: String, required: true },
    courseTitle: { type: String },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

const SeminarBooking: Model<ISeminarBooking> = mongoose.models.SeminarBooking || mongoose.model<ISeminarBooking>('SeminarBooking', SeminarBookingSchema);

export default SeminarBooking;
