import mongoose, { Schema, Document } from 'mongoose';

export interface IWebRequest extends Document {
    path: string;
    method: string;
    ip: string;
    userAgent: string;
    timestamp: Date;
}

const webRequestSchema = new Schema<IWebRequest>({
    path: { type: String, required: true },
    method: { type: String, required: true },
    ip: { type: String, default: 'unknown' },
    userAgent: { type: String, default: 'unknown' },
    timestamp: { type: Date, default: Date.now },
});

// TTL index to automatically delete documents older than 30 days (2592000 seconds)
webRequestSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

// Compound index to make reporting grouped by day and path faster
webRequestSchema.index({ timestamp: -1, path: 1 });

const WebRequest = mongoose.models.WebRequest || mongoose.model<IWebRequest>('WebRequest', webRequestSchema);

export default WebRequest;
