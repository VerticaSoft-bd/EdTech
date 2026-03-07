import mongoose, { Document, Model, Schema } from 'mongoose';
import slugify from 'slugify';

export interface ITopic {
    title: string;
}

export interface IModule {
    title: string;
    topics: ITopic[];
}

export interface IBatch {
    startDate: string;
    classTime: string;
}

export interface ICareerOpportunity {
    title: string;
    description: string;
}

export interface IFeature {
    title: string;
    description: string;
}

export interface IBenefit {
    icon: string;
    title: string;
    subtitle: string;
}

export interface ISuccessStory {
    name: string;
    role: string;
}

export interface ITestimonial {
    text: string;
    name: string;
}

export interface IFAQ {
    question: string;
    answer: string;
}

export interface IDemoClass {
    date: string;
    time: string;
    platform: string;
}

export interface ICourse extends Document {
    title: string;
    slug: string;
    subtitle: string;
    category: string;
    level: string;
    courseMode: string;
    duration: string;
    batches: IBatch[];
    totalStudents: number;
    totalLectures: number;
    totalProjects: number;
    fullDetails: string;
    targetAudience: string[];
    keyDeliverables: string[];
    modules: IModule[];
    thumbnail?: string;
    introVideo?: string;
    studentProjects: string[];
    regularFee: number;
    discountPercentage: number;
    admissionUrl?: string;
    seminarUrl?: string;
    isFree: boolean;
    assignedTeachers: mongoose.Types.ObjectId[];
    careerOpportunities: ICareerOpportunity[];
    uniqueFeatures: IFeature[];
    totalPreRecordedVideos: number;
    enrollmentDeadline: string;
    totalSeats: number;
    batchNumber: string;
    benefits: IBenefit[];
    whatYouWillLearn: { text: string; icon: string }[];
    successStories: ISuccessStory[];
    testimonials: ITestimonial[];
    faqs: IFAQ[];
    tools: { name: string; image: string }[];
    demoClass: IDemoClass;
    status: 'Draft' | 'Active' | 'Archived';
}

const TopicSchema = new Schema<ITopic>({
    title: { type: String, required: true },
});

const ModuleSchema = new Schema<IModule>({
    title: { type: String, required: true },
    topics: [TopicSchema],
});

const BatchSchema = new Schema<IBatch>({
    startDate: { type: String, required: true },
    classTime: { type: String, required: true },
});

const CareerOpportunitySchema = new Schema<ICareerOpportunity>({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const BenefitSchema = new Schema<IBenefit>({
    icon: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
});

const SuccessStorySchema = new Schema<ISuccessStory>({
    name: { type: String, required: true },
    role: { type: String, required: true },
});

const TestimonialSchema = new Schema<ITestimonial>({
    text: { type: String, required: true },
    name: { type: String, required: true },
});

const FAQSchema = new Schema<IFAQ>({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const DemoClassSchema = new Schema<IDemoClass>({
    date: { type: String },
    time: { type: String },
    platform: { type: String },
});

const FeatureSchema = new Schema<IFeature>({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const CourseSchema: Schema<ICourse> = new Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    subtitle: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, required: true },
    courseMode: { type: String, required: true },
    duration: { type: String, required: true },
    batches: { type: [BatchSchema], default: [] },
    totalStudents: { type: Number, default: 0 },
    totalLectures: { type: Number, default: 0 },
    totalProjects: { type: Number, default: 0 },
    fullDetails: { type: String, required: true },
    targetAudience: { type: [String], default: [] },
    keyDeliverables: { type: [String], default: [] },
    modules: { type: [ModuleSchema], default: [] },
    thumbnail: { type: String },
    introVideo: { type: String },
    studentProjects: { type: [String], default: [] },
    regularFee: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    admissionUrl: { type: String },
    seminarUrl: { type: String },
    isFree: { type: Boolean, default: false },
    assignedTeachers: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    careerOpportunities: { type: [CareerOpportunitySchema], default: [] },
    uniqueFeatures: { type: [FeatureSchema], default: [] },
    totalPreRecordedVideos: { type: Number, default: 0 },
    enrollmentDeadline: { type: String },
    totalSeats: { type: Number, default: 0 },
    batchNumber: { type: String },
    benefits: { type: [BenefitSchema], default: [] },
    whatYouWillLearn: { type: [{ text: { type: String, required: true }, icon: { type: String } }], default: [] },
    successStories: { type: [SuccessStorySchema], default: [] },
    testimonials: { type: [TestimonialSchema], default: [] },
    faqs: { type: [FAQSchema], default: [] },
    tools: { type: [{ name: { type: String, required: true }, image: { type: String } }], default: [] },
    demoClass: { type: DemoClassSchema, default: {} },
    status: {
        type: String,
        enum: ['Draft', 'Active', 'Archived'],
        default: 'Draft',
    }
}, { timestamps: true });

CourseSchema.pre<ICourse>('save', function (next: any) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 1000);
    }
    next();
});

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
