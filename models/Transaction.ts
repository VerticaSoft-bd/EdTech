import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'earning', 'job_posting', 'referral_bonus', 'refund', 'service_fee'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'rejected'],
        default: 'pending',
    },
    method: {
        type: String, // e.g., 'bkash', 'nagad', 'internal'
    },
    transactionId: {
        type: String, // Internal Invoice Number
    },
    gateway_ref: {
        type: String, // PayStation Trx ID
    },
    senderNumber: {
        type: String,
        required: false,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    description: String,
}, { timestamps: true });

// Force recompilation in development to handle schema changes
if (process.env.NODE_ENV === 'development' && mongoose.models.Transaction) {
    delete mongoose.models.Transaction;
}

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
