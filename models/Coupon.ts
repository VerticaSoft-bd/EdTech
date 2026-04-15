import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    discountType: 'Percentage' | 'Fixed';
    discountValue: number;
    description?: string;
    expiryDate: Date;
    isActive: boolean;
    usageLimit?: number;
    usageCount: number;
}

const CouponSchema: Schema<ICoupon> = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['Percentage', 'Fixed'], required: true },
    discountValue: { type: Number, required: true },
    description: { type: String },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0 },
}, { timestamps: true });

const Coupon: Model<ICoupon> = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
