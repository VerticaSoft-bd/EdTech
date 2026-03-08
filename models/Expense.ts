import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IExpense extends Document {
    title: string;
    amount: number;
    category: string;
    type: 'daily' | 'monthly';
    date: Date;
    notes?: string;
    paidBy?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ExpenseSchema: Schema<IExpense> = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Expense title is required'],
            trim: true,
        },
        amount: {
            type: Number,
            required: [true, 'Expense amount is required'],
            min: 0,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            default: 'Other',
        },
        type: {
            type: String,
            enum: ['daily', 'monthly'],
            required: true,
            default: 'daily',
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        notes: { type: String, trim: true },
        paidBy: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);

// Clear Mongoose schema cache for hot-reloading in Next.js
if (mongoose.models.Expense) {
    delete mongoose.models.Expense;
}

const Expense: Model<IExpense> = mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
