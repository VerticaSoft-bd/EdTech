import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEmployee extends Document {
    name: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    monthlySalary: number;
    joinDate: Date;
    status: 'active' | 'inactive';
    employeeType: 'teacher' | 'staff' | 'other';
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const EmployeeSchema: Schema<IEmployee> = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Employee name is required'], trim: true },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
        },
        phone: { type: String, trim: true },
        department: {
            type: String,
            required: true,
            trim: true,
            default: 'General',
        },
        designation: { type: String, trim: true },
        monthlySalary: {
            type: Number,
            required: [true, 'Monthly salary is required'],
            min: 0,
        },
        joinDate: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
        },
        employeeType: {
            type: String,
            enum: ['teacher', 'staff', 'other'],
            default: 'staff',
        },
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);

// Clear Mongoose schema cache for hot-reloading in Next.js
if (mongoose.models.Employee) {
    delete mongoose.models.Employee;
}

const Employee: Model<IEmployee> = mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
