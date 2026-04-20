import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMCQQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface ITask extends Document {
    title: string;
    description: string;
    type: 'Assignment' | 'MCQ' | 'Project';
    points: number;
    courseId: mongoose.Types.ObjectId;
    teacherId: mongoose.Types.ObjectId;
    deadline?: Date;
    mcqQuestions?: IMCQQuestion[];
    attachments?: string[];
    status: 'Draft' | 'Published';
    createdAt: Date;
    updatedAt: Date;
}

const MCQQuestionSchema = new Schema<IMCQQuestion>({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
});

const TaskSchema: Schema<ITask> = new Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        type: {
            type: String,
            enum: ['Assignment', 'MCQ', 'Project'],
            required: true,
        },
        points: { type: Number, required: true, default: 0 },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        deadline: { type: Date },
        mcqQuestions: { type: [MCQQuestionSchema], default: [] },
        attachments: { type: [String], default: [] },
        status: {
            type: String,
            enum: ['Draft', 'Published'],
            default: 'Published',
        },
    },
    { timestamps: true }
);

// Clear mongoose cache for Task to ensure hot reload works in Next.js
if (mongoose.models.Task) {
    delete mongoose.models.Task;
}

const Task: Model<ITask> = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
