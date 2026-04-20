"use client";
import React, { useState, useEffect } from 'react';
import { 
    Users, 
    BookOpen, 
    Monitor, 
    MapPin, 
    ChevronRight, 
    Search, 
    Settings, 
    CheckCircle2, 
    Clock, 
    BarChart3,
    ArrowLeft,
    TrendingUp,
    MoreHorizontal,
    Edit3,
    ArrowRight
} from 'lucide-react';

export default function StudentManagementPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'Online' | 'Offline'>('Offline');
    const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [coursesRes, batchesRes] = await Promise.all([
                    fetch('/api/courses'),
                    fetch('/api/batches')
                ]);
                const coursesData = await coursesRes.json();
                const batchesData = await batchesRes.json();

                if (coursesData.success) setCourses(coursesData.data);
                if (batchesData.success) setBatches(batchesData.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedBatchId) {
            const fetchBatchStudents = async () => {
                try {
                    const res = await fetch(`/api/students?batchId=${selectedBatchId}`);
                    const data = await res.json();
                    if (data.success) {
                        setStudents(data.data);
                    }
                } catch (error) {
                    console.error("Failed to fetch students:", error);
                }
            };
            fetchBatchStudents();
        }
    }, [selectedBatchId]);

    const filteredCourses = courses.filter(course => {
        const mode = course.courseMode?.toLowerCase() || '';
        return mode.includes(activeTab.toLowerCase());
    });

    const getBatchesForCourse = (courseId: string) => {
        return batches.filter(batch => {
            // Check if batch is assigned to this course (via assignedBatches in course model)
            const course = courses.find(c => c._id === courseId);
            return course?.assignedBatches?.includes(batch._id);
        });
    };

    const handleUpdateProgress = async (studentId: string, progress: number) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/students/${studentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ progress })
            });
            const data = await res.json();
            if (data.success) {
                // Update local state
                setStudents(prev => prev.map(s => s._id === studentId ? { ...s, progress } : s));
            }
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdateAttendance = async (studentId: string, attendedClasses: number) => {
        setIsUpdating(true);
        try {
            const res = await fetch(`/api/students/${studentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attendedClasses })
            });
            const data = await res.json();
            if (data.success) {
                // Update local state
                setStudents(prev => prev.map(s => s._id === studentId ? { ...s, attendedClasses } : s));
            }
        } catch (error) {
            console.error("Update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const selectedBatch = batches.find(b => b._id === selectedBatchId);
    const selectedCourse = courses.find(c => c.assignedBatches?.includes(selectedBatchId));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading management console...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A1D1F] flex items-center gap-3">
                        <Users className="text-[#6C5DD3]" size={32} />
                        Student Management
                    </h1>
                    <p className="text-gray-500 mt-2">Manage your batches, track progress, and update student records.</p>
                </div>

                <div className="flex bg-white/60 backdrop-blur-md p-1 rounded-2xl border border-white shadow-sm self-start">
                    <button
                        onClick={() => { setActiveTab('Offline'); setSelectedBatchId(null); }}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'Offline' ? 'bg-[#6C5DD3] text-white shadow-lg shadow-[#6C5DD3]/20' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        <MapPin size={18} />
                        Offline Courses
                    </button>
                    <button
                        onClick={() => { setActiveTab('Online'); setSelectedBatchId(null); }}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'Online' ? 'bg-[#6C5DD3] text-white shadow-lg shadow-[#6C5DD3]/20' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                        <Monitor size={18} />
                        Online Courses
                    </button>
                </div>
            </div>

            {!selectedBatchId ? (
                /* Course & Batch Selection Grid */
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => {
                            const courseBatches = getBatchesForCourse(course._id);

                            return (
                                <div key={course._id} className="space-y-4">
                                    <div className="flex items-center gap-3 px-4">
                                        <div className="h-8 w-1 bg-[#6C5DD3] rounded-full"></div>
                                        <h2 className="text-xl font-bold text-[#1A1D1F]">{course.title}</h2>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold uppercase tracking-wider">{courseBatches.length} Batches</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {courseBatches.map((batch) => (
                                            <div 
                                                key={batch._id}
                                                className="group bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-[#6C5DD3]/5 transition-all duration-300 relative overflow-hidden"
                                            >
                                                {/* Decorative background element */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#6C5DD3]/5 rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>
                                                
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="p-3 bg-[#6C5DD3]/10 rounded-2xl text-[#6C5DD3]">
                                                            <BookOpen size={24} />
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${batch.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                            {batch.status}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-xl font-bold text-[#1A1D1F] mb-2">{batch.name}</h3>
                                                    <div className="space-y-2 mb-6">
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Clock size={14} />
                                                            <span>{batch.timing} • {batch.schedule}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Users size={14} />
                                                            <span>{batch.enrolledStudents || 0} Students Enrolled</span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => setSelectedBatchId(batch._id)}
                                                        className="w-full py-4 bg-[#F4F4F4] hover:bg-[#6C5DD3] hover:text-white rounded-2xl text-sm font-bold text-[#1A1D1F] transition-all flex items-center justify-center gap-2 group/btn"
                                                    >
                                                        Manage Batch
                                                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {courseBatches.length === 0 && (
                                            <div className="col-span-full bg-white/50 backdrop-blur-sm rounded-[32px] p-12 border border-dashed border-gray-200 text-center">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <Users className="text-gray-300" size={24} />
                                                </div>
                                                <p className="text-gray-500 font-medium">No active batches assigned to you for this course.</p>
                                                <p className="text-xs text-gray-400 mt-1">Once you're assigned to a batch, it will appear here for management.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white rounded-[32px] p-20 border border-gray-100 text-center shadow-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="text-gray-300" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#1A1D1F] mb-2">No courses found</h3>
                            <p className="text-gray-500">You don't have any assigned {activeTab} courses with active batches.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* Batch Management Detailed View */
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <button 
                        onClick={() => setSelectedBatchId(null)}
                        className="flex items-center gap-2 text-sm font-bold text-[#6C5DD3] hover:translate-x-[-4px] transition-transform"
                    >
                        <ArrowLeft size={18} />
                        Back to Batches
                    </button>

                    <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                        {/* Header Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
                            <div className="md:col-span-8 flex items-center gap-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-[#6C5DD3] to-[#8E8AFF] rounded-3xl flex items-center justify-center text-white shadow-lg shadow-[#6C5DD3]/20 shrink-0">
                                    <Users size={40} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-[#1A1D1F]">{selectedBatch?.name}</h2>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <span className="px-3 py-1 bg-[#6C5DD3]/10 text-[#6C5DD3] text-[10px] font-bold rounded-lg uppercase tracking-wider">{selectedCourse?.title}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-sm font-bold text-gray-500">{selectedBatch?.timing} • {selectedBatch?.schedule}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-4 flex justify-end items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Active Students</p>
                                    <p className="text-3xl font-black text-[#6C5DD3]">{students.length}</p>
                                </div>
                                <div className="h-12 w-px bg-gray-100"></div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Batch Status</p>
                                    <div className="flex items-center gap-2 justify-end mt-1">
                                        <div className="w-2 h-2 rounded-full bg-[#4BD37B] animate-pulse"></div>
                                        <p className="text-sm font-bold text-[#1A1D1F]">{selectedBatch?.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search students..." 
                                    className="w-full pl-12 pr-6 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 transition-all border border-transparent focus:border-[#6C5DD3]/30"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-[#6C5DD3]/10 hover:text-[#6C5DD3] transition-all">
                                    <TrendingUp size={20} />
                                </button>
                                <button className="p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-[#6C5DD3]/10 hover:text-[#6C5DD3] transition-all">
                                    <Settings size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student Information</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress Metrics</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Attendance</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {students.filter(s => s.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                                        <tr key={student._id} className="group hover:bg-[#F8F7FF] transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <img 
                                                            src={student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.fullName)}&background=6C5DD3&color=fff`} 
                                                            className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" 
                                                            alt="" 
                                                        />
                                                        {student.status === 'Active' && (
                                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#4BD37B] border-2 border-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-[#1A1D1F]">{student.fullName}</h4>
                                                        <p className="text-xs text-gray-500">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 min-w-[200px]">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Current Progress</span>
                                                    <span className="text-sm font-bold text-[#6C5DD3]">{student.progress || 0}%</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-[#6C5DD3] to-[#8E8AFF] rounded-full transition-all duration-1000 ease-out" 
                                                            style={{ width: `${student.progress || 0}%` }}
                                                        ></div>
                                                    </div>
                                                    {activeTab === 'Offline' && (
                                                        <div className="flex items-center gap-1">
                                                            <input 
                                                                type="number" 
                                                                className="w-12 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-[#6C5DD3]/20"
                                                                value={student.progress || 0}
                                                                onChange={(e) => {
                                                                    const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                                                    handleUpdateProgress(student._id, val);
                                                                }}
                                                                disabled={isUpdating}
                                                            />
                                                            <span className="text-xs text-gray-400">%</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="inline-flex items-center gap-4 bg-gray-50/50 px-4 py-2 rounded-2xl border border-gray-100">
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Attended</p>
                                                        {activeTab === 'Offline' ? (
                                                            <input 
                                                                type="number" 
                                                                className="w-10 text-center bg-transparent text-sm font-bold text-[#1A1D1F] outline-none"
                                                                value={student.attendedClasses || 0}
                                                                onChange={(e) => {
                                                                    const val = Math.max(0, parseInt(e.target.value) || 0);
                                                                    handleUpdateAttendance(student._id, val);
                                                                }}
                                                                disabled={isUpdating}
                                                            />
                                                        ) : (
                                                            <p className="text-sm font-bold text-[#1A1D1F]">{student.attendedClasses || 0}</p>
                                                        )}
                                                    </div>
                                                    <div className="h-6 w-px bg-gray-200"></div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
                                                        <p className="text-sm font-bold text-gray-500">{student.totalClasses || 0}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2.5 text-gray-400 hover:text-[#6C5DD3] hover:bg-[#6C5DD3]/10 rounded-xl transition-all">
                                                        <BarChart3 size={18} />
                                                    </button>
                                                    <button className="p-2.5 text-gray-400 hover:text-[#6C5DD3] hover:bg-[#6C5DD3]/10 rounded-xl transition-all">
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center text-gray-400">
                                                <p className="flex flex-col items-center gap-3">
                                                    <Users size={32} className="text-gray-200" />
                                                    No students found in this batch.
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Info */}
                        <div className="p-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#4BD37B]"></div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Status Icons</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#6C5DD3]"></div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">In Progress</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">Updates are saved automatically as you type.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
