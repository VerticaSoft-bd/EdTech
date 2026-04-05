'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { User, CheckCircle, XCircle, Clock, Calendar, Search, Save, ChevronRight, Loader2, Users, CheckSquare, XSquare, QrCode, FileText, LayoutGrid, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import QrCodeModal from './QrCodeModal';
import AttendanceMonthlyReport from './AttendanceMonthlyReport';

interface StudentEnrollment {
    studentId: string;
    fullName: string;
    email: string;
    status: 'Present' | 'Absent' | 'Late';
    attendedAt?: string;
}

const AttendanceManager: React.FC = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const isToday = useMemo(() => selectedDate === new Date().toISOString().split('T')[0], [selectedDate]);
    const [students, setStudents] = useState<StudentEnrollment[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchStudents();
        }
    }, [selectedCourse, selectedDate]);

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/courses');
            const data = await res.json();
            if (data.success) {
                setCourses(data.data);
                if (data.data.length > 0) setSelectedCourse(data.data[0].title);
            }
        } catch (err) {
            toast.error('Failed to load courses');
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/enrollments?status=completed&limit=100`);
            const data = await res.json();
            
            if (data.success) {
                const filtered = data.data.filter((e: any) => e.metadata?.courseName === selectedCourse);
                const historyRes = await fetch(`/api/admin/attendance/history?courseName=${encodeURIComponent(selectedCourse)}&date=${selectedDate}`);
                const historyData = await historyRes.json();
                const existingAttendance = historyData.data || [];

                const attendanceMap = new Map<string, { status: string, attendedAt?: string }>(
                    existingAttendance.map((a: any) => [
                        a.studentEmail, 
                        { status: a.status, attendedAt: a.attendedAt || a.updatedAt }
                    ])
                );

                const studentList: StudentEnrollment[] = filtered.map((e: any) => {
                    const email = e.metadata?.email || e.user?.email || '';
                    const record = attendanceMap.get(email);
                    return {
                        studentId: e.user?._id || e.metadata?.studentId || '',
                        fullName: e.user?.name || e.metadata?.fullName || e.metadata?.name || 'Unknown Student',
                        email: email,
                        status: (record?.status as any) || 'Present',
                        attendedAt: record?.attendedAt
                    };
                });

                setStudents(studentList);
            }
        } catch (err) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = (index: number, status: 'Present' | 'Absent' | 'Late') => {
        const newStudents = [...students];
        newStudents[index].status = status;
        newStudents[index].attendedAt = new Date().toISOString(); // Local optimistic update
        setStudents(newStudents);
    };

    const markAllStatus = (status: 'Present' | 'Absent' | 'Late') => {
        const now = new Date().toISOString();
        const newStudents = students.map(s => ({ ...s, status, attendedAt: now }));
        setStudents(newStudents);
        toast.success(`All marked as ${status}`);
    };

    const handleSave = async () => {
        if (!selectedCourse || !selectedDate) {
            toast.error('Please select both course and date');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/admin/attendance/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    courseName: selectedCourse,
                    date: selectedDate,
                    students: students.map(s => ({
                        studentId: s.studentId,
                        email: s.email,
                        status: s.status
                    }))
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Attendance saved successfully');
            } else {
                throw new Error(data.error);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to save attendance');
        } finally {
            setSaving(false);
        }
    };

    const filteredStudents = students.filter(s => 
        s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = useMemo(() => {
        return {
            total: students.length,
            present: students.filter(s => s.status === 'Present').length,
            absent: students.filter(s => s.status === 'Absent').length,
            late: students.filter(s => s.status === 'Late').length,
        };
    }, [students]);

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users size={20} />} label="Total Students" value={stats.total} color="bg-blue-50 text-blue-600 border-blue-100" />
                <StatCard icon={<CheckCircle size={20} />} label="Present" value={stats.present} color="bg-green-50 text-green-600 border-green-100" />
                <StatCard icon={<XCircle size={20} />} label="Absent" value={stats.absent} color="bg-red-50 text-red-600 border-red-100" />
                <StatCard icon={<Clock size={20} />} label="Late" value={stats.late} color="bg-amber-50 text-amber-600 border-amber-100" />
            </div>

            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1A1D1F]">Attendance Manager</h2>
                        <p className="text-sm text-gray-500 mt-1">Efficiently track student presence</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="date" 
                                className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold text-[#1A1D1F] focus:ring-2 focus:ring-[#6C5DD3] outline-none"
                                value={selectedDate}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={handleSave}
                            disabled={saving || loading || students.length === 0 || !isToday}
                            className={`flex items-center gap-2 bg-[#6C5DD3] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] disabled:opacity-50 transition-all text-sm ${!isToday ? 'grayscale opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            {isToday ? 'Save' : 'View Only'}
                        </button>
                    </div>
                </div>

                {/* View Selection Tabs */}
                <div className="flex items-center gap-2 p-1 bg-gray-100/50 rounded-2xl w-fit mb-8 border border-gray-100">
                    <button 
                        onClick={() => setActiveTab('daily')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'daily' ? 'bg-white text-[#6C5DD3] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <LayoutGrid size={14} />
                        Daily Marking
                    </button>
                    <button 
                        onClick={() => setActiveTab('monthly')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs transition-all ${activeTab === 'monthly' ? 'bg-white text-[#6C5DD3] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <FileText size={14} />
                        Monthly Report
                    </button>
                </div>

                {activeTab === 'daily' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {!isToday && (
                            <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
                                <Filter size={18} className="text-amber-500" />
                                <p className="text-xs font-bold text-amber-700">
                                    History View: You are viewing records for {new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}. Marking is disabled.
                                </p>
                            </div>
                        )}
                        {/* Bulk Actions Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-2xl gap-4 mb-8 border border-gray-100">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Quick Actions:</span>
                                <BulkActionButton 
                                    icon={<CheckSquare size={16} />} 
                                    label="Mark All Present" 
                                    onClick={() => markAllStatus('Present')}
                                    variant="green"
                                    disabled={!isToday}
                                />
                                <BulkActionButton 
                                    icon={<XSquare size={16} />} 
                                    label="Mark All Absent" 
                                    onClick={() => markAllStatus('Absent')}
                                    variant="red"
                                    disabled={!isToday}
                                />
                            </div>
                            <button 
                                onClick={() => setIsQrModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[#1A1D1F] text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                <QrCode size={16} className="text-[#6C5DD3]" />
                                Generate QR Check-in
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Select Course</label>
                                <select 
                                    className="w-full p-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-[#1A1D1F] outline-none"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    {courses.map(course => (
                                        <option key={course._id} value={course.title}>{course.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Search Students</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="Name or email..."
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium outline-none"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-50">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Student Info</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50/50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Loader2 className="animate-spin text-[#6C5DD3]" size={32} />
                                                    <p className="text-sm font-medium text-gray-500">Syncing student records...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredStudents.length > 0 ? (
                                        filteredStudents.map((student, idx) => (
                                            <tr key={student.email} className="hover:bg-gray-50/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C5DD3]/10 to-[#6C5DD3]/5 flex items-center justify-center text-[#6C5DD3] font-bold text-sm shadow-sm">
                                                            {student.fullName.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col leading-tight">
                                                            <span className="text-sm font-bold text-[#1A1D1F] group-hover:text-[#6C5DD3] transition-colors">{student.fullName}</span>
                                                            <span className="text-[11px] text-gray-400">{student.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center">
                                                        <StatusBadge status={student.status} attendedAt={student.attendedAt} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                        <ActionButton 
                                                            active={student.status === 'Present'} 
                                                            onClick={() => updateStatus(students.indexOf(student), 'Present')} 
                                                            color="green" 
                                                            icon={<CheckCircle size={16} />} 
                                                            disabled={!isToday}
                                                        />
                                                        <ActionButton 
                                                            active={student.status === 'Absent'} 
                                                            onClick={() => updateStatus(students.indexOf(student), 'Absent')} 
                                                            color="red" 
                                                            icon={<XCircle size={16} />} 
                                                            disabled={!isToday}
                                                        />
                                                        <ActionButton 
                                                            active={student.status === 'Late'} 
                                                            onClick={() => updateStatus(students.indexOf(student), 'Late')} 
                                                            color="amber" 
                                                            icon={<Clock size={16} />} 
                                                            disabled={!isToday}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-3 opacity-40">
                                                    <Search size={40} />
                                                    <p className="text-sm font-medium">No students found matching your search</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 min-h-[400px]">
                        {!selectedCourse ? (
                            <div className="py-24 flex flex-col items-center justify-center opacity-40">
                                <FileText size={48} className="mb-4" />
                                <p className="text-sm font-bold uppercase tracking-widest">Select a course to view monthly records</p>
                            </div>
                        ) : (
                            <AttendanceMonthlyReport 
                                courseName={selectedCourse} 
                                students={students.map(s => ({ studentId: s.studentId, name: s.fullName, email: s.email }))} 
                            />
                        )}
                    </div>
                )}
            </div>

            {/* QR Modal */}
            <QrCodeModal 
                isOpen={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
                courseName={selectedCourse}
                date={selectedDate}
            />
        </div>
    );
};

// Helper Components
const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) => (
    <div className={`p-4 rounded-3xl border ${color} shadow-sm transition-transform hover:scale-[1.02] cursor-default`}>
        <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/50">{icon}</div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</span>
                <span className="text-2xl font-black">{value}</span>
            </div>
        </div>
    </div>
);

const BulkActionButton = ({ icon, label, onClick, variant, disabled }: { icon: React.ReactNode, label: string, onClick: () => void, variant: 'green' | 'red', disabled?: boolean }) => {
    const colors = {
        green: 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100',
        red: 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
    };
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed ${colors[variant]}`}
        >
            {icon}
            {label}
        </button>
    );
};

const ActionButton = ({ active, onClick, color, icon, disabled }: { active: boolean, onClick: () => void, color: 'green' | 'red' | 'amber', icon: React.ReactNode, disabled?: boolean }) => {
    const activeColors = {
        green: 'bg-green-500 text-white shadow-md shadow-green-200',
        red: 'bg-red-500 text-white shadow-md shadow-red-200',
        amber: 'bg-amber-500 text-white shadow-md shadow-amber-200'
    };
    const hoverColors = {
        green: 'hover:bg-green-100 hover:text-green-600',
        red: 'hover:bg-red-100 hover:text-red-600',
        amber: 'hover:bg-amber-100 hover:text-amber-600'
    };
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${active ? activeColors[color] : `bg-gray-50 text-gray-400 ${!disabled ? hoverColors[color] : ''}`}`}
        >
            {icon}
        </button>
    );
};

const StatusBadge = ({ status, attendedAt }: { status: string, attendedAt?: string }) => {
    const styles = {
        Present: 'bg-green-100 text-green-600',
        Absent: 'bg-red-100 text-red-600',
        Late: 'bg-amber-100 text-amber-600'
    };
    
    // Using simple approach to avoid complex imports in helper
    const timeSource = attendedAt;
    const timeStr = timeSource ? new Date(timeSource).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    return (
        <div className="flex flex-col items-center gap-1 relative group/badge">
            <div 
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-default transition-transform group-hover/badge:scale-110 ${(styles as any)[status]}`}
            >
                {status === 'Present' && <CheckCircle size={10} />}
                {status === 'Absent' && <XCircle size={10} />}
                {status === 'Late' && <Clock size={10} />}
                {status}
            </div>

            {/* Premium Floating Tooltip */}
            {timeStr && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover/badge:opacity-100 transition-all duration-200 translate-y-2 group-hover/badge:translate-y-0">
                    <div className="bg-[#1A1D1F] text-white p-3 rounded-2xl shadow-2xl shadow-black/20 border border-white/10 min-w-[140px] backdrop-blur-md">
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Marked at</span>
                            <span className="text-xl font-black tracking-tight text-white whitespace-nowrap">
                                {timeStr}
                            </span>
                        </div>
                        {/* Tooltip Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#1A1D1F]"></div>
                    </div>
                </div>
            )}

            {timeStr && (
                <span className="text-[8px] font-bold text-gray-300 transition-colors leading-none tracking-tighter opacity-60">
                    {timeStr}
                </span>
            )}
        </div>
    );
};

export default AttendanceManager;
