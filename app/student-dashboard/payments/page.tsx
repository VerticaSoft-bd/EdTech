import React from "react";
import Header from "@/app/components/Header";
import { getAuthenticatedUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { FileText, Download, CreditCard } from "lucide-react";
import Student from "@/models/Student";
import PaymentFeeStatus from "@/app/components/student/PaymentFeeStatus";

export default async function PaymentHistoryPage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/login');
  }

  await dbConnect();

  // Fetch all transaction history for the user
  const transactions = await Transaction.find({ user: user._id })
    .sort({ createdAt: -1 })
    .lean();

  // Fetch student enrollments for fee status
  const enrollments = await Student.find({ email: user.email }).lean();

  const totalFee = enrollments.reduce((sum, e) => sum + (Number(e.totalCourseFee) || 0), 0);
  const paidAmount = enrollments.reduce((sum, e) => sum + (Number(e.paidAmount) || 0), 0);
  const dueAmount = enrollments.reduce((sum, e) => sum + (Number(e.dueAmount) || 0), 0);
  const nextDueDate = enrollments.some(e => Number(e.dueAmount) > 0) ? "Contact Office" : "Paid";

  return (
    <div className="min-h-screen bg-white text-[#1A1D1F] scroll-smooth">
      <Header />
      
      <main className="max-w-[1240px] mx-auto p-6 md:p-10">
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#1A1D1F] flex items-center gap-3">
                <div className="w-12 h-12 bg-[#6C5DD3]/10 rounded-2xl flex items-center justify-center text-[#6C5DD3]">
                    <CreditCard size={28} />
                </div>
                Payment History & Invoices
            </h1>
            <p className="text-gray-500 mt-2 ml-15">
                Manage your billing, view transaction history and download invoices.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-1">
                <PaymentFeeStatus 
                    totalFee={totalFee}
                    paidAmount={paidAmount}
                    dueAmount={dueAmount}
                    nextDueDate={nextDueDate}
                    currency="৳"
                    studentEmail={user.email}
                />
            </div>
            <div className="lg:col-span-2 bg-[#F8FAFC] rounded-[2rem] p-10 border border-gray-100 flex flex-col justify-between h-full relative overflow-hidden transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C5DD3]/5 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#6C5DD3]">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#1A1D1F]">Secure Payments</h3>
                            <p className="text-[11px] font-bold text-[#6C5DD3] uppercase tracking-wider">Fast & Encrypted</p>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-8 max-w-lg leading-relaxed font-medium">
                        All payments are processed through secure encrypted gateways. You can pay your dues using bKash, Rocket, Nagad or any local and international card.
                    </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-8 pt-6 border-t border-gray-100/50">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Bkash_logo.png" className="h-6 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" alt="bKash" />
                    <img src="https://seeklogo.com/images/N/nagad-logo-7A70BBDA73-seeklogo.com.png" className="h-7 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" alt="Nagad" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Visa_2021.svg/2560px-Visa_2021.svg.png" className="h-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-6 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" alt="Mastercard" />
                </div>
            </div>
        </div>

        <div id="transaction-history" className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <h2 className="font-bold text-[#1A1D1F]">Transaction History</h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{transactions?.length || 0} Records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                  <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {transactions && transactions.length > 0 ? (
                  transactions.map((txn: any) => (
                    <tr key={txn._id.toString()} className="hover:bg-gray-50 transition-colors">
                      <td className="p-6 text-gray-600 font-medium whitespace-nowrap">
                        {format(new Date(txn.createdAt), "MMMM dd, yyyy")}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#6C5DD3]"></span>
                          <span className="text-[#1A1D1F] font-bold capitalize">{txn.method || 'Online Payment'}</span>
                        </div>
                      </td>
                      <td className="p-6 font-black text-[#1A1D1F] text-lg">
                        ৳{txn.amount.toLocaleString()}
                      </td>
                      <td className="p-6 text-center">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase ${
                          txn.status === 'completed' ? 'bg-[#4BD37B]/10 text-[#4BD37B]' :
                          txn.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                          'bg-red-50 text-red-500'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <Link 
                          href={`/invoice/${txn.transactionId}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-xs font-bold hover:bg-[#5a4cb5] transition-all shadow-lg shadow-[#6C5DD3]/20 active:scale-95"
                        >
                          <Download size={14} />
                          Get Invoice
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-400 bg-gray-50/20">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                            <FileText size={32} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-medium">No transaction history available on this account.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-[#1A1D1F] to-[#2D3339] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C5DD3] opacity-10 blur-[80px] -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-2">Need help with billing?</h3>
                    <p className="text-gray-400 text-sm max-w-md italic">
                        If you have any questions regarding your invoices or payments, please feel free to reach out to our support team.
                    </p>
                </div>
                <button className="px-8 py-4 bg-white text-[#1A1D1F] font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-xl">
                    Contact Support
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}
