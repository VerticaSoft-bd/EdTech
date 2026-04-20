import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INotification extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        link: { type: String },
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Index for getting unread notifications quickly
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

if (mongoose.models.Notification) {
    delete mongoose.models.Notification;
}

const Notification: Model<INotification> = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
