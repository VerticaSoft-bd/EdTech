import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string; // Optional if you decide to implement OAuth later
    role: 'student' | 'teacher' | 'admin' | 'staff';
    staffPermissions?: string[];
    passwordChangeAttempts: number;
    lastPasswordAttemptAt?: Date;
    mobileNo?: string;
    presentAddress?: string;
    fatherName?: string;
    motherName?: string;
    guardianMobileNo?: string;
    dateOfBirth?: string;
    nidNo?: string;
    gender?: string;
    maritalStatus?: string;
    residentialStatus?: string;
    country?: string;
    education?: string;
    designation?: string;
    bio?: string;
    image?: string;
    expertise?: string[];
    slug?: string;
    needsPasswordSetup?: boolean;
    magicLoginToken?: string;
    magicLoginTokenExpires?: Date;
    resetPasswordOTP?: string;
    resetPasswordOTPExpire?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false, // Prevents password from being returned in queries by default
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin', 'staff'],
        default: 'student',
    },
    staffPermissions: {
        type: [String],
        default: [],
    },
    passwordChangeAttempts: {
        type: Number,
        default: 0,
    },
    lastPasswordAttemptAt: {
        type: Date,
    },
    mobileNo: { type: String, trim: true },
    presentAddress: { type: String, trim: true },
    fatherName: { type: String, trim: true },
    motherName: { type: String, trim: true },
    guardianMobileNo: { type: String, trim: true },
    dateOfBirth: { type: String, trim: true },
    nidNo: { type: String, trim: true },
    gender: { type: String, trim: true },
    maritalStatus: { type: String, trim: true },
    residentialStatus: { type: String, trim: true },
    country: { type: String, trim: true },
    education: { type: String, trim: true },
    designation: { type: String, trim: true },
    bio: { type: String, trim: true },
    image: { type: String },
    expertise: { type: [String], default: [] },
    slug: { type: String, unique: true, sparse: true },
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpire: { type: Date },
    needsPasswordSetup: { type: Boolean, default: false },
    magicLoginToken: { type: String },
    magicLoginTokenExpires: { type: Date },
}, { timestamps: true });

// Pre-save hook to hash the password and generate slug before saving
UserSchema.pre<IUser>('save', async function () {
    // Generate slug for teachers if name is modified or slug is missing
    if (this.role === 'teacher' && (this.isModified('name') || !this.slug)) {
        try {
            const _slugify = require('slugify');
            const slugFunc = typeof _slugify === 'function' ? _slugify : _slugify.default;
            if (typeof slugFunc === 'function') {
                this.slug = slugFunc(this.name, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 1000);
            }
        } catch (err) {
            console.error("Slug generation failed for User:", err);
        }
    }

    if (!this.isModified('password')) {
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password as string, salt);
    } catch (error: any) {
        throw error;
    }
});

// Instance method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password as string);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
