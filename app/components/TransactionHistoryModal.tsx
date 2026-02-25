import React from "react";

interface TransactionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
}

export default function TransactionHistoryModal({ isOpen, onClose, student }: TransactionHistoryModalProps) {
    if (!isOpen || !student) return null;

    // We don't have a separate transactions table yet, so we'll mock the transaction
    const transactions = [
        {
            id: 'TXN-' + Math.floor(Math.random() * 1000000),
            date: new Date(student.createdAt).toLocaleDateString(),
            amount: student.paidAmount || 0,
            type: 'Course Fee Payment',
            status: 'Completed',
            method: 'Cash/Bank',
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
            <div className="bg-white rounded-[24px] shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
                    <h3 className="text-xl font-bold text-[#1A1D1F]">Transaction History</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    <div className="mb-6 flex items-center gap-4 border-b border-gray-100 pb-4">
                        {student.avatar ? (
                            <img src={student.avatar} alt={student.fullName} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center font-bold">
                                {student.fullName?.charAt(0) || '?'}
                            </div>
                        )}
                        <div>
                            <h4 className="font-bold text-[#1A1D1F]">{student.fullName}</h4>
                            <p className="text-xs text-gray-500">{student.mobileNo}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[16px] border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Txn ID</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase">Type</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase text-right">Amount</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {transactions.length === 0 || (transactions.length === 1 && transactions[0].amount === 0) ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">No transactions found.</td>
                                    </tr>
                                ) : (
                                    transactions.map(txn => (
                                        <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-medium text-[#1A1D1F]">{txn.id}</td>
                                            <td className="p-4 text-gray-600">{txn.date}</td>
                                            <td className="p-4 text-gray-600">{txn.type}</td>
                                            <td className="p-4 font-bold text-green-600 text-right">৳{txn.amount}</td>
                                            <td className="p-4 text-center">
                                                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#4BD37B]/10 text-[#4BD37B]">
                                                    {txn.status}
                                                </span>
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
    );
}
