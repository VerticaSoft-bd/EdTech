import React from "react";
import FeeStatusCard from "@/app/components/FeeStatusCard";
import AttendanceChart from "@/app/components/AttendanceChart";
import JobFeed from "@/app/components/JobFeed";
import Header from "@/app/components/Header";
import { getAuthenticatedUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";
import Course from "@/models/Course";
import Attendance from "@/models/Attendance";
import Transaction from "@/models/Transaction";
import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, Download, FileText } from "lucide-react";
import ClientDashboardWrapper from "./ClientDashboardWrapper";

export default async function StudentDashboard() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect('/login');
  }

  await dbConnect();

  // Fetch student enrollments
  const enrollments = await Student.find({ email: user.email }).lean();

  const badgesCount = enrollments.length;
  const certificatesCount = enrollments.filter((e: any) => e.progress === 100).length;

  // Extract course names to query rich course data
  const enrolledCourseNames = enrollments.map(e => e.courseName);

  // Fetch rich course data for the enrolled courses
  const enrolledCourses = await Course.find({ title: { $in: enrolledCourseNames } }).lean();

  // Fetch recent attendance history (last 5 records)
  const attendanceHistory = await Attendance.find({ studentEmail: user.email })
    .sort({ date: -1 })
    .limit(5)
    .lean();

  // Fetch recent transaction history
  const transactions = await Transaction.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return (
    <div className="min-h-screen bg-white text-[#1A1D1F] scroll-smooth">
      <Header />
      <ClientDashboardWrapper needsPasswordSetup={!!user.needsPasswordSetup} />

      <main className="max-w-[1600px] mx-auto p-6 md:p-8 grid grid-cols-12 gap-8">
        <div className="col-span-12">
          {/* Greeting & Stats */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1D1F] flex items-center gap-2">
                Good morning, {user.name}
                <span className="animate-wave origin-bottom-right inline-block">
                  👋🏻
                </span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                Welcome to Youth Ins, Check your priority learning.
              </p>
            </div>
            <div className="flex items-center gap-3 text-white text-xs font-semibold">
              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFAB7B] to-[#FFCF9D] shadow-lg shadow-[#FFAB7B]/20 flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2l3 7h7l-5 5 2 7-7-4-7 4 2-7-5-5h7z" /></svg>
                </div>
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-[13px]">{badgesCount.toString().padStart(2, '0')}</span>
                  <span className="opacity-80 text-[10px] font-normal">Badge</span>
                </div>
              </div>
              <div className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9AD5] to-[#FFC2E8] shadow-lg shadow-[#FF9AD5]/20 flex items-center gap-2">
                <div className="p-1 bg-white/20 rounded-full">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /></svg>
                </div>
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="text-[13px]">{certificatesCount.toString().padStart(2, '0')}</span>
                  <span className="opacity-80 text-[10px] font-normal">Certificates</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Payment History Shortcut */}
        <div className="col-span-12 -mt-4 mb-2 flex justify-end">
            <a 
                href="#payment-history"
                className="text-xs font-bold text-[#6C5DD3] flex items-center gap-1.5 hover:bg-[#6C5DD3]/5 px-3 py-1.5 rounded-lg transition-all"
            >
                <FileText size={14} />
                Billing History
            </a>
        </div>

        {/* Feature Banner */}
        <div className="col-span-12 relative overflow-hidden bg-gradient-to-r from-white to-[#E2E6FF] p-6 rounded-2xl shadow-sm border border-white">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-[#6C5DD3] to-transparent opacity-30"></div>
          <div className="relative z-10 flex items-start justify-between">
            <div className="w-full">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-1 bg-[#FF4C4C] text-white text-[10px] font-bold rounded-lg uppercase tracking-wide">
                  New
                </span>
                <h3 className="font-bold text-[#1A1D1F]">
                  Feature Discussion
                </h3>
              </div>
              <p className="text-sm text-gray-500 w-full leading-relaxed">
                Smart Tutoring are a new feature in &quot;Feature Discussion&quot;
                Can be explain the material problem chat.{" "}
                <a
                  href="#"
                  className="text-[#1A1D1F] font-bold inline-flex items-center hover:underline decoration-2 underline-offset-4"
                >
                  Go to detail{" "}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="ml-1"
                  >
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">




          {/* My Courses */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#1A1D1F]">My Courses</h2>
              <Link
                href="/courses"
                className="text-sm font-bold text-[#6C5DD3] hover:underline"
              >
                View All Courses
              </Link>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {enrolledCourses.map((course: any, idx) => {
                  const gradients = [
                    "from-[#8E8AFF] to-[#B4B1FF]",
                    "from-[#FFAB7B] to-[#FFCF9D]",
                    "from-[#FF9AD5] to-[#FFC2E8]"
                  ];
                  const textColors = ["text-[#6C5DD3]", "text-[#FFAB7B]", "text-[#FF9AD5]"];
                  const bgColors = ["bg-[#6C5DD3]/10", "bg-[#FFAB7B]/10", "bg-[#FF9AD5]/10"];

                  const colorIdx = idx % gradients.length;

                  return (
                    <Link
                      href={`/student-dashboard/courses/${course.slug}/progress`}
                      key={course._id.toString()}
                      className="bg-[#F6F8FA] p-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer block"
                    >
                      <div
                        className={`h-[180px] rounded-xl bg-gradient-to-r ${gradients[colorIdx]} relative p-6 flex flex-col justify-between overflow-hidden`}
                      >
                        {/* Noise Background & Decorative Stars */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40"></div>

                        {/* Distributed Stars/Sparkles */}
                        <div className="absolute top-4 left-6 text-white/60 text-lg animate-pulse">✦</div>
                        <div className="absolute top-8 right-20 text-white/40 text-xs">✦</div>
                        <div className="absolute bottom-16 left-8 text-white/30 text-sm">✦</div>
                        <div className="absolute bottom-6 right-8 text-white/50 text-xl">✦</div>
                        <div className="absolute top-1/2 left-1/2 text-white/20 text-[10px]">✦</div>
                        <div className="absolute top-16 right-4 text-white/30 text-base">✦</div>
                        <div className="flex justify-end">
                          <div className="bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-medium">
                            {course.modules?.length || 0} Modules
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xl font-bold text-white mb-4 leading-tight line-clamp-2">
                            {course.title}
                          </h3>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`p-1.5 rounded-lg ${bgColors[colorIdx]}`}>
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              className={textColors[colorIdx]}
                              strokeWidth="2.5"
                            >
                              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                          </span>
                        </div>

                        <p className="text-sm font-bold text-[#1A1D1F] mb-4 leading-relaxed line-clamp-2 min-h-[40px]">
                          {course.subtitle || "Enhancing Learning Engagement"}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mb-6">
                          <span className="px-3 py-1.5 bg-gray-50 rounded-xl text-xs font-semibold text-gray-400">
                            {course.courseMode || "Online"}
                          </span>
                          <span className="px-3 py-1.5 bg-gray-50 rounded-xl text-xs font-semibold text-gray-400">
                            {course.duration || "Self-paced"}
                          </span>
                        </div>

                        <div className="pt-2">
                          <span className="text-xs font-bold text-[#6C5DD3]">
                            Continue Learning &rarr;
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-10 mt-4 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-500" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven't enrolled in any courses yet. Browse our catalog to start learning!</p>
                <Link href="/courses" className="px-6 py-3 bg-[#6C5DD3] text-white rounded-xl font-bold shadow-lg hover:bg-[#5a4cb5] transition-colors inline-block">
                  Explore Courses
                </Link>
              </div>
            )}
          </div>

          {/* In Progress */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#1A1D1F] flex items-center gap-2">
                In progress learning content
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A4A4A4"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </h2>
              <a
                href="#"
                className="text-sm font-bold text-[#6C5DD3] hover:underline"
              >
                View All
              </a>
            </div>
            <div className="space-y-4">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course: any, idx) => {
                  const enrollment = enrollments.find(e => e.courseName === course.title);
                  const progress = enrollment?.progress || 0;
                  const materials = course.modules?.length || 0;

                  const gradients = [
                    "from-[#8E8AFF] to-[#B4B1FF]",
                    "from-[#FF9AD5] to-[#FFC2E8]",
                    "from-[#FFAB7B] to-[#FFCF9D]"
                  ];
                  const thumbGradient = gradients[idx % gradients.length];

                  return (
                    <Link
                      href={`/student-dashboard/courses/${course.slug}/progress`}
                      key={course._id.toString()}
                      className="bg-[#F0F2F4] p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center gap-4 hover:shadow-md transition-shadow group cursor-pointer"
                    >
                      {/* Thumbnail */}
                      <div
                        className={`w-[120px] h-[70px] rounded-xl bg-gradient-to-br ${thumbGradient} relative p-4 flex flex-col justify-center shrink-0 overflow-hidden`}
                      >
                        {/* Noise & Sparkles for Thumbnail */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
                        <div className="absolute top-2 left-2 text-white/50 text-[8px]">✦</div>

                        <div className="relative z-10">
                          <h4 className="text-[11px] font-bold text-white leading-[1.3] mb-1.5 line-clamp-2">
                            {course.title}
                          </h4>
                        </div>
                      </div>
                      <div className="flex-1 grid grid-cols-12 gap-4 items-center w-full">
                        <div className="col-span-12 md:col-span-4">
                          <div className="flex items-center gap-2 mb-1">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FF754C"
                              strokeWidth="2.5"
                            >
                              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-500">
                              Course
                            </span>
                          </div>
                          <h4 className="font-bold text-[#1A1D1F] text-sm truncate pr-4">
                            {course.subtitle || course.title}
                          </h4>
                        </div>

                        <div className="col-span-4 md:col-span-2">
                          <div className="text-[10px] text-gray-400 mb-1">
                            Content
                          </div>
                          <div className="text-xs font-bold text-[#1A1D1F] flex items-center gap-1.5">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            {materials} {course.courseMode === 'Offline' ? 'Classes' : 'Modules'}
                          </div>
                        </div>

                        <div className="col-span-4 md:col-span-2">
                          <div className="text-[10px] text-gray-400 mb-1">
                            Completion
                          </div>
                          <div className="text-xs font-bold text-[#1A1D1F] flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full border-2 border-[#4BD37B] border-t-transparent flex items-center justify-center transform -rotate-45"></div>
                            {progress}%
                          </div>
                        </div>

                        <div className="col-span-4 md:col-span-2">
                          <div className="text-[10px] text-gray-400 mb-1">
                            Deadline
                          </div>
                          <div className={`text-xs font-bold flex items-center gap-1.5 text-[#1A1D1F]`}>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {course.duration || "Self-paced"}
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-2 text-right">
                          <span className="inline-block px-4 py-1.5 bg-white border border-gray-200 rounded-[10px] text-xs font-bold text-[#1A1D1F] group-hover:bg-gray-50 group-hover:border-gray-300 transition-colors shadow-sm">
                            Continue
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-500 text-sm">
                  No learning content in progress.
                </div>
              )}
            </div>
          </div>
          
          {/* Payment History & Invoices */}
          <div id="payment-history" className="mt-12 mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1A1D1F] flex items-center gap-2">
                Payment History
                <span className="text-[10px] text-gray-400 font-normal uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-lg">Billing</span>
              </h2>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Method</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                      <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {transactions && transactions.length > 0 ? (
                      transactions.map((txn: any) => (
                        <tr key={txn._id.toString()} className="hover:bg-gray-50 transition-colors group">
                          <td className="p-4 text-gray-600 font-medium">
                            {format(new Date(txn.createdAt), "MMM dd, yyyy")}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#6C5DD3]/40"></span>
                              <span className="text-[#1A1D1F] font-bold capitalize">{txn.method || 'Online'}</span>
                            </div>
                          </td>
                          <td className="p-4 font-black text-[#1A1D1F]">
                            ৳{txn.amount.toLocaleString()}
                          </td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                              txn.status === 'completed' ? 'bg-[#4BD37B]/10 text-[#4BD37B]' :
                              txn.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                              'bg-red-50 text-red-500'
                            }`}>
                              {txn.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <Link 
                              href={`/invoice/${txn.transactionId}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-[#6C5DD3] hover:bg-[#6C5DD3] hover:text-white hover:border-[#6C5DD3] transition-all shadow-sm active:scale-95"
                            >
                              <FileText size={14} />
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-10 text-center text-gray-400 italic bg-gray-50/30">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                              <Download size={20} className="text-gray-300" />
                            </div>
                            <span>No payment records found yet.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Status & Career) */}
        <div className="col-span-12 lg:col-span-4 space-y-6 mt-12">

          {/* Fee Status (Critical) */}
          <FeeStatusCard
            totalFee={enrollments.reduce((sum, e) => sum + (Number(e.totalCourseFee) || 0), 0)}
            paidAmount={enrollments.reduce((sum, e) => sum + (Number(e.paidAmount) || 0), 0)}
            nextDueDate={enrollments.some(e => Number(e.dueAmount) > 0) ? "Contact Office" : "Paid"}
            currency="৳"
          />

          {/* Attendance Tracker */}
          <div className="h-[340px]">
            <AttendanceChart
              present={enrollments.reduce((sum, e: any) => sum + (e.attendedClasses || 0), 0)}
              limit={enrollments.reduce((sum, e: any) => sum + (e.totalClasses || 0), 0) || 1}
            />
          </div>

          {/* Attendance History List */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
            <h3 className="font-bold text-[#1A1D1F] mb-4 flex items-center justify-between">
              Recent Attendance
              <span className="text-[10px] text-gray-400 font-normal uppercase tracking-widest">Last 5 Classes</span>
            </h3>
            <div className="space-y-3">
              {attendanceHistory.length > 0 ? (
                attendanceHistory.map((record: any) => (
                  <div key={record._id.toString()} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        record.status === 'Present' ? 'bg-green-100 text-green-600' :
                        record.status === 'Absent' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        {record.status === 'Present' ? <CheckCircle size={14} /> :
                         record.status === 'Absent' ? <XCircle size={14} /> :
                         <Clock size={14} />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1A1D1F] line-clamp-1">{record.courseName}</p>
                        <p className="text-[10px] text-gray-400">{format(new Date(record.date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase ${
                      record.status === 'Present' ? 'text-green-600' :
                      record.status === 'Absent' ? 'text-red-600' :
                      'text-amber-600'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-400 text-xs italic">
                  No attendance records found yet.
                </div>
              )}
            </div>
          </div>

          {/* Job Feed & CV Builder */}
          <JobFeed />
        </div>

        {/* Global Payment History Section - Spanning full width at bottom */}
        <div id="payment-history" className="col-span-12 mt-12 mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-[#1A1D1F] flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6C5DD3]/10 rounded-xl flex items-center justify-center text-[#6C5DD3]">
                    <FileText size={20} />
                </div>
                Payment History & Invoices
                <span className="text-[10px] text-gray-400 font-normal uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">Billing Center</span>
              </h2>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
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
        </div>
      </main>
      {/* Floating AI Assistant Button (SRS) */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-[#1A1D1F] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform z-50 group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8E8AFF] to-[#6C5DD3] rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-spin-slow"></div>
        <div className="relative z-10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path><path d="M12 22a2 2 0 0 1 2-2v-2a2 2 0 0 1-2-2 2 2 0 0 1-2 2v2a2 2 0 0 1 2 2z"></path><path d="M22 12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2 2 2 0 0 1 2-2h2a2 2 0 0 1 2 2z"></path><path d="M6 12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2 2 2 0 0 1 2-2h2a2 2 0 0 1 2 2z"></path><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>
        </div>
      </button>
    </div>
  );
}
