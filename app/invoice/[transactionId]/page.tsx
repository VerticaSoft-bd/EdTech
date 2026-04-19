import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Student from '@/models/Student';
import React from 'react';
import PrintInvoiceButton from '@/app/components/PrintInvoiceButton';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function InvoicePage({ params }: { params: Promise<{ transactionId: string }> }) {
    await dbConnect();
    const { transactionId } = await params;
    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) return notFound();

    const metadata = transaction.metadata || {};
    const courseName = metadata?.courseName || 'Course Enrollment';
    const userName = metadata?.fullName || 'Student';
    const userEmail = metadata?.email || 'N/A';
    const date = new Date(transaction.updatedAt || transaction.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Fetch student and payment history
    const student = await Student.findOne({ email: userEmail, courseName: courseName });
    
    // Get all completed transactions for this student and course to calculate previous payments
    const allStudentTransactions = await Transaction.find({
        'metadata.email': userEmail,
        'metadata.courseName': courseName,
        status: 'completed'
    }).sort({ createdAt: 1 }).lean();

    // Calculate previous paid sum (before this transaction)
    let previousPaid = 0;
    for (const tx of allStudentTransactions) {
        const txDate = new Date(tx.createdAt).getTime();
        const currentTxDate = new Date(transaction.createdAt).getTime();
        
        if (txDate < currentTxDate) {
            previousPaid += tx.amount;
        }
    }

    const totalPaidSoFar = previousPaid + transaction.amount;
    const fullCourseFee = student?.totalCourseFee || transaction.amount;
    const dueAmount = Math.max(0, fullCourseFee - totalPaidSoFar);
    const isFullPaid = dueAmount <= 0;

    return (
        <div className="min-h-screen bg-[#F8F9FB] py-12 px-4 print:bg-white print:py-0 print:px-0">
            <div className="max-w-[600px] mx-auto bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden print:shadow-none print:max-w-none print:w-full border border-gray-100 print:border-none">
                {/* Header Section */}
                <div className="bg-[#6C5DD3] p-10 text-white relative overflow-hidden print:bg-white print:text-black print:border-b-2 print:border-gray-100 print:p-6 print:pb-8">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 print:hidden" />
                    
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <img src="/images/logo.png" alt="Logo" className="h-12 mb-6 brightness-0 invert print:brightness-100 print:invert-0" />
                            <h1 className="text-4xl font-black tracking-tight mb-1">INVOICE</h1>
                            <p className="text-white/70 font-medium text-sm">No. {transaction.transactionId}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-bold mb-1">Youth Ins</h2>
                            <p className="text-white/70 text-xs">support@youthins.com</p>
                            <p className="text-white/70 text-xs">Dhaka, Bangladesh</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 print:p-6">
                    {/* Information Grid */}
                    <div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b border-gray-100">
                        <div>
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-3">Invoice To</h3>
                            <p className="text-lg font-bold text-gray-900 leading-tight">{userName}</p>
                            <p className="text-sm text-gray-500 mt-1">{userEmail}</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-3">Issue Date</h3>
                            <p className="text-lg font-bold text-gray-900 leading-tight">{date}</p>
                            <p className="text-sm text-green-500 font-bold mt-1 uppercase tracking-wider">{transaction.status}</p>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="mb-10">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-6">Payment Details</h3>
                        <div className="flex justify-between items-center p-6 bg-gray-50 rounded-2xl border border-gray-100/50 mb-4">
                            <div>
                                <p className="font-bold text-gray-900">{courseName}</p>
                                <p className="text-xs text-gray-500 mt-1">Course Enrollment Fee</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-black text-gray-900">৳{transaction.amount.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-400 mt-1">Current Payment</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 px-2">
                            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Course Fee</p>
                                <p className="text-lg font-black text-gray-700">৳{fullCourseFee.toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Previous Paid</p>
                                <p className="text-lg font-black text-gray-700">৳{previousPaid.toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-3 px-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Method</span>
                                <span className="font-bold text-gray-900">{transaction.method || 'N/A'}</span>
                            </div>
                            {transaction.processedBy && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Processed By</span>
                                    <span className="font-medium text-gray-700 italic text-xs">{transaction.processedBy}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total Section */}
                    <div className="bg-[#6C5DD3]/5 rounded-3xl p-8 border border-[#6C5DD3]/10">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div className="text-center sm:text-left">
                                <span className="text-[10px] font-bold text-[#6C5DD3] uppercase tracking-[0.2em] mb-2 block">Total Amount Paid</span>
                                <h2 className="text-4xl font-black text-[#6C5DD3]">৳{transaction.amount.toLocaleString()}</h2>
                            </div>
                            
                            <div className="h-px w-full sm:h-12 sm:w-px bg-[#6C5DD3]/20" />

                            <div className="text-center sm:text-right">
                                {isFullPaid ? (
                                    <div className="flex flex-col items-center sm:items-end">
                                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-[0.2em] mb-2 block">Status</span>
                                        <h2 className="text-2xl font-black text-green-600">FULL PAID</h2>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center sm:items-end">
                                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em] mb-2 block">Due Amount</span>
                                        <h2 className="text-4xl font-black text-orange-600">৳{dueAmount.toLocaleString()}</h2>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-[10px] text-[#6C5DD3]/60 mt-6 font-medium italic text-center">Handcrafted with care for your education</p>
                    </div>

                    {/* Footer Note */}
                    <div className="mt-10 pt-10 border-t border-gray-100 text-center">
                        <p className="text-xs text-gray-400">
                            This is a computer-generated invoice and does not require a physical signature.
                        </p>
                        <p className="text-sm font-bold text-gray-900 mt-4">Thank you for choosing Youth Ins!</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="max-w-[600px] mx-auto mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden px-4">
                <Link 
                    href="/dashboard/students?mode=offline" 
                    className="flex-1 w-full sm:w-auto px-8 py-3 bg-white text-gray-600 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all text-center"
                >
                    Back to Dashboard
                </Link>
                <div className="flex-1 w-full sm:w-auto scale-110">
                    <PrintInvoiceButton />
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body { background: white !important; }
                    .print\\:hidden { display: none !important; }
                    @page { margin: 0; }
                }
            ` }} />
        </div>
    );
}

