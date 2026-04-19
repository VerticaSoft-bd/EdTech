import React, { useState, useEffect } from "react";
import AddPaymentModal from "./AddPaymentModal";
import Link from "next/link";

interface TransactionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
    onUpdate?: () => void; // Optional callback to refresh parent data
}

export default function TransactionHistoryModal({ isOpen, onClose, student, onUpdate }: TransactionHistoryModalProps) {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

    const fetchTransactions = async () => {
        if (!student?.email) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/transactions?email=${encodeURIComponent(student.email)}`);
            const data = await res.json();
            if (data.success) {
                setTransactions(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && student) {
            fetchTransactions();
        }
    }, [isOpen, student]);

    if (!isOpen || !student) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
                <div className="bg-white rounded-[24px] shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-bold text-[#1A1D1F]">Transaction History</h3>
                            <button
                                onClick={() => setIsAddPaymentOpen(true)}
                                className="px-3 py-1.5 bg-[#4BD37B]/10 text-[#4BD37B] hover:bg-[#4BD37B]/20 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Add Payment
                            </button>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 p-6">
                        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-4">
                                {student.avatar ? (
                                    <img src={student.avatar} alt={student.fullName} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center font-bold text-lg">
                                        {student.fullName?.charAt(0) || '?'}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-[#1A1D1F]">{student.fullName}</h4>
                                    <p className="text-xs text-gray-500">{student.mobileNo}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total Paid</p>
                                    <p className="text-lg font-extrabold text-[#4BD37B]">৳{student.paidAmount || 0}</p>
                                </div>
                                <div className="text-right border-l border-gray-100 pl-6">
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Course Due</p>
                                    <p className="text-lg font-extrabold text-[#FF4C4C]">৳{(student.totalCourseFee - student.paidAmount) || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[16px] border border-gray-100 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50/50">
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Type / Method</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                                        <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500">Loading transactions...</td>
                                        </tr>
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500">No transactions found.</td>
                                        </tr>
                                    ) : (
                                        transactions.map(txn => (
                                            <tr key={txn._id} className="hover:bg-gray-50 transition-all group">
                                                <td className="p-4">
                                                    <p className="font-medium text-[#1A1D1F]">{new Date(txn.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-[10px] text-gray-400">{txn.transactionId}</p>
                                                </td>
                                                <td className="p-4">
                                                    <p className="font-bold text-[#1A1D1F] text-xs">
                                                        {txn.type === 'manual_payment' ? 'Manual Payment' : 
                                                         txn.type === 'course_purchase' ? 'Course Purchase' : txn.type}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500">{txn.method || 'N/A'}</p>
                                                </td>
                                                <td className="p-4 font-bold text-[#4BD37B] text-right">৳{txn.amount.toLocaleString()}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                                        txn.status === 'completed' ? 'bg-[#4BD37B]/10 text-[#4BD37B]' : 
                                                        txn.status === 'pending' ? 'bg-[#FFAB7B]/10 text-[#FFAB7B]' : 
                                                        'bg-red-50 text-red-500'
                                                    }`}>
                                                        {txn.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link 
                                                        href={`/invoice/${txn.transactionId}`}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-[#6C5DD3] hover:text-white rounded-lg text-[11px] font-bold transition-all shadow-sm group-hover:shadow-md border border-gray-100"
                                                    >
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                                            <rect x="6" y="14" width="12" height="8"></rect>
                                                        </svg>
                                                        Print
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <AddPaymentModal
                isOpen={isAddPaymentOpen}
                onClose={() => setIsAddPaymentOpen(false)}
                onSuccess={() => {
                    fetchTransactions();
                    if (onUpdate) onUpdate();
                }}
                student={student}
            />
        </>
    );
}
