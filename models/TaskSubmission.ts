import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITaskSubmission extends Document {
    taskId: mongoose.Types.ObjectId;
    studentId: mongoose.Types.ObjectId;
    content?: string; // For Assignment/Project (Text or URL)
    mcqAnswers?: number[]; // For MCQ (indices of selected options)
    pointsEarned?: number;
    feedback?: string;
    status: 'Submitted' | 'Graded' | 'Late';
    submittedAt: Date;
    gradedAt?: Date;
    gradedBy?: mongoose.Types.ObjectId;
}

const TaskSubmissionSchema: Schema<ITaskSubmission> = new Schema(
    {
        taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String },
        mcqAnswers: { type: [Number], default: [] },
        pointsEarned: { type: Number },
        feedback: { type: String },
        status: {
            type: String,
            enum: ['Submitted', 'Graded', 'Late'],
            default: 'Submitted',
        },
        submittedAt: { type: Date, default: Date.now },
        gradedAt: { type: Date },
        gradedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

// Prevent duplicate submissions for the same task by the same student
TaskSubmissionSchema.index({ taskId: 1, studentId: 1 }, { unique: true });

if (mongoose.models.TaskSubmission) {
    delete mongoose.models.TaskSubmission;
}

const TaskSubmission: Model<ITaskSubmission> = mongoose.model<ITaskSubmission>('TaskSubmission', TaskSubmissionSchema);

export default TaskSubmission;
