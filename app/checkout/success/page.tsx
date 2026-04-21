import { redirect } from 'next/navigation';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Link from 'next/link';
import { getAuthenticatedUser } from '@/lib/auth';
import { CheckCircle, ArrowRight, FileText, Banknote, MapPin, Tag, CreditCard, Calendar } from 'lucide-react';
import React from 'react';

export default async function SuccessPage({
    searchParams
}: {
    searchParams: Promise<{ transactionId?: string; mode?: string; courseName?: string; email?: string }>
}) {
    const params = await searchParams;
    const transactionId = params.transactionId;
    const isOffline = params.mode === 'offline';

    if (!transactionId && !isOffline) {
        redirect('/dashboard');
    }

    try {
        await dbConnect();

        let transaction = null;
        let courseName = params.courseName || 'Course Enrollment';
        let userEmail = params.email || 'N/A';
        let formattedAmount = '৳0';
        let date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        if (transactionId) {
            // Find the transaction by its internal ID
            transaction = await Transaction.findOne({ transactionId });

            if (!transaction && !isOffline) {
                return (
                    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-red-500 font-bold text-xl">!</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Transaction Not Found</h1>
                            <p className="text-gray-500 mb-6">We could not locate the transaction details for the provided ID.</p>
                            <Link href="/dashboard" className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                Return to Dashboard
                            </Link>
                        </div>
                    </div>
                );
            }

            if (transaction) {
                formattedAmount = new Intl.NumberFormat('en-BD', {
                    style: 'currency',
                    currency: 'BDT',
                    minimumFractionDigits: 0
                }).format(transaction.amount);

                const metadata = transaction.metadata || {};
                courseName = metadata?.courseName || courseName;
                userEmail = metadata?.email || userEmail;
                date = new Date(transaction.updatedAt || transaction.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        }

        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <div className="max-w-2xl w-full">
                    {/* Success Header Card */}
                    <div className="bg-white rounded-t-2xl shadow-sm border border-gray-100 p-8 text-center relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-2 ${isOffline ? 'bg-orange-500' : 'bg-green-500'}`}></div>

                        <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full ${isOffline ? 'bg-orange-100' : 'bg-green-100'} mb-6 relative`}>
                            <CheckCircle className={`h-10 w-10 ${isOffline ? 'text-orange-600' : 'text-green-600'}`} />
                            <div className={`absolute inset-0 rounded-full border ${isOffline ? 'border-orange-400' : 'border-green-400'} animate-ping opacity-20`}></div>
                        </div>

                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                            {isOffline ? 'Registration Confirmed!' : 'Enrollment Successful!'}
                        </h1>
                        <p className="text-lg text-gray-600 mb-2">
                            {isOffline ? 'Please visit our office to complete your payment.' : 'Thank you for your purchase.'}
                        </p>
                        <p className="text-sm text-gray-500">A confirmation {isOffline ? 'registration' : 'enrollment'} email has been sent to {userEmail}</p>

                        <div className="mt-8 py-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-center items-center space-x-4">
                            <div className="text-center px-4 border-r border-gray-200">
                                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Payment Status</p>
                                <p className={`text-xl font-bold mt-1 ${isOffline ? 'text-orange-600' : 'text-green-600'}`}>
                                    {isOffline ? 'Pay at Office' : formattedAmount}
                                </p>
                            </div>
                            <div className="text-center px-4">
                                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Status</p>
                                <p className={`text-sm font-medium mt-1 uppercase px-3 py-1 rounded-full inline-block ${isOffline ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                    {isOffline ? 'Pending Payment' : (transaction?.status || 'Completed')}
                                </p>
                            </div>
                        </div>

                        {isOffline && (
                            <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl text-left">
                                <div className="flex items-center gap-2 text-orange-800 font-bold mb-2">
                                    <MapPin className="h-4 w-4" />
                                    Office Instructions
                                </div>
                                <p className="text-sm text-orange-700 leading-relaxed">
                                    Your data has been sent to our Accounts department. Please visit our physical office at your earliest convenience to clear the payment and finalize your enrollment.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-white rounded-b-2xl shadow-sm border border-t-0 border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-gray-400" />
                            {isOffline ? 'Registration Details' : 'Order Summary'}
                        </h2>

                        <dl className="space-y-6">
                            <div className="flex justify-between items-start">
                                <dt className="flex items-center text-sm font-medium text-gray-500">
                                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                                    Course Name
                                </dt>
                                <dd className="text-sm font-semibold text-gray-900 text-right max-w-xs">{courseName}</dd>
                            </div>

                            {transaction && (
                                <div className="flex justify-between items-start">
                                    <dt className="flex items-center text-sm font-medium text-gray-500">
                                        <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                                        Order ID
                                    </dt>
                                    <dd className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{transaction.transactionId}</dd>
                                </div>
                            )}

                            {transaction?.gateway_ref && (() => {
                                let refData: any = null;
                                try {
                                    refData = typeof transaction.gateway_ref === 'string'
                                        ? JSON.parse(transaction.gateway_ref)
                                        : transaction.gateway_ref;
                                } catch (e) {
                                    // Not JSON
                                }

                                return refData ? (
                                    <>
                                        {refData.payment_method && (
                                            <div className="flex justify-between items-start">
                                                <dt className="flex items-center text-sm font-medium text-gray-500">
                                                    <Banknote className="h-4 w-4 mr-2 text-gray-400" />
                                                    Payment Method
                                                </dt>
                                                <dd className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{refData.payment_method}</dd>
                                            </div>
                                        )}
                                    </>
                                ) : null;
                            })()}

                            <div className="flex justify-between items-start">
                                <dt className="flex items-center text-sm font-medium text-gray-500">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    Date & Time
                                </dt>
                                <dd className="text-sm text-gray-900 text-right">{date}</dd>
                            </div>
                        </dl>

                        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link href="/student-dashboard" className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all hover:shadow-md">
                                Go to Dashboard
                                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                            </Link>
                            {!isOffline && transaction && (
                                <Link href={`/invoice/${transaction.transactionId}`} target="_blank" className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all hover:text-gray-900">
                                    Download Invoice
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Need help? <a href="#" className="font-medium text-blue-600 hover:text-blue-500 underline decoration-blue-200 underline-offset-2">Contact Support</a>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Success Page Error:", error);
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-500 font-bold text-xl">X</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                    <p className="text-gray-500 mb-6">We could not load your transaction details at this time. Don't worry, if your payment was successful, your account has been updated.</p>
                    <Link href="/dashboard" className="inline-flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }
}
