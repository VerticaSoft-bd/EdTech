import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import React from 'react';
import PrintInvoiceButton from '@/app/components/PrintInvoiceButton';
import { notFound } from 'next/navigation';

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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="max-w-3xl mx-auto p-10 bg-white min-h-screen text-black">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#6C5DD3]">INVOICE</h1>
                    <p className="text-gray-500 mt-2 text-sm font-medium">Transaction: {transaction.transactionId}</p>
                </div>
                <div className="sm:text-right">
                    <h2 className="text-2xl font-bold text-gray-900">Youth Ins</h2>
                    <p className="text-gray-500 text-sm">support@youthins.com</p>
                    <p className="text-gray-500 text-sm">Dhaka, Bangladesh</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between mb-10 gap-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                    <p className="text-lg font-bold text-gray-900">{userName}</p>
                    <p className="text-gray-600">{userEmail}</p>
                </div>
                <div className="sm:text-right">
                    <div className="mb-2">
                        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-1">Invoice Date</span>
                        <p className="text-gray-900 font-medium">{date}</p>
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                        <p className="text-green-600 font-bold uppercase">{transaction.status}</p>
                    </div>
                </div>
            </div>

            <table className="w-full text-left border-collapse mb-10">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="py-3 px-2 font-bold text-gray-700">Description</th>
                        <th className="py-3 px-2 text-right font-bold text-gray-700">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-gray-100">
                        <td className="py-5 px-2">
                            <p className="font-bold text-lg text-gray-900">{courseName}</p>
                            <p className="text-sm text-gray-500 mt-1">Course Enrollment Fee</p>
                        </td>
                        <td className="py-5 px-2 text-right font-bold text-gray-900">৳{transaction.amount.toLocaleString()}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td className="py-6 px-2 text-xl font-bold text-right border-t-2 border-gray-200">Total Paid</td>
                        <td className="py-6 px-2 text-2xl font-extrabold text-right border-t-2 border-gray-200 text-[#6C5DD3]">৳{transaction.amount.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>

            <div className="text-center text-sm text-gray-500 mt-16 pb-10">
                <p className="font-medium text-gray-600">Thank you for your business!</p>
                <PrintInvoiceButton />
            </div>
        </div>
    );
}
