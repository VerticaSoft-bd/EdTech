"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
    Plus, 
    Search, 
    FileText, 
    CheckSquare, 
    Layout, 
    MoreVertical, 
    Eye, 
    Edit, 
    Trash2,
    Users,
    Clock,
    Award
} from 'lucide-react';
import { showToast } from "@/lib/toast";

export default function TasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('All');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksRes, coursesRes] = await Promise.all([
                fetch('/api/tasks'),
                fetch('/api/courses')
            ]);

            const tasksData = await tasksRes.json();
            const coursesData = await coursesRes.json();

            if (tasksData.success) setTasks(tasksData.data);
            if (coursesData.success) setCourses(coursesData.data);
        } catch (error) {
            showToast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        showToast.confirm(
            "Are you sure you want to delete this task?",
            async () => {
                try {
                    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
                    const data = await res.json();
                    if (data.success) {
                        showToast.success("Task deleted successfully");
                        setTasks(tasks.filter(t => t._id !== id));
                    } else {
                        showToast.error(data.message || "Failed to delete task");
                    }
                } catch (error) {
                    showToast.error("An error occurred");
                }
            }
        );
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCourse = selectedCourse === 'All' || task.courseId === selectedCourse;
        return matchesSearch && matchesCourse;
    });

    const getTaskIcon = (type: string) => {
        switch (type) {
            case 'MCQ': return <CheckSquare className="text-blue-500" size={18} />;
            case 'Project': return <Layout className="text-purple-500" size={18} />;
            default: return <FileText className="text-orange-500" size={18} />;
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Header section with Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#1A1D1F]">Task Management</h1>
                    <p className="text-sm text-gray-500">Create and manage assignments for your students</p>
                </div>
                <Link 
                    href="/dashboard/tasks/create" 
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-all"
                >
                    <Plus size={18} />
                    Create New Task
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search tasks by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#6C5DD3]/20"
                    />
                </div>
                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="pl-4 pr-10 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold text-[#1A1D1F] focus:ring-2 focus:ring-[#6C5DD3]/20"
                >
                    <option value="All">All Courses</option>
                    {courses.map(course => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                </select>
            </div>

            {/* Tasks List */}
            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6C5DD3]"></div>
                </div>
            ) : filteredTasks.length > 0 ? (
                <div className="grid gap-4">
                    {filteredTasks.map((task) => (
                        <div key={task._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                        {getTaskIcon(task.type)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                task.type === 'MCQ' ? 'bg-blue-50 text-blue-600' :
                                                task.type === 'Project' ? 'bg-purple-50 text-purple-600' :
                                                'bg-orange-50 text-orange-600'
                                            }`}>
                                                {task.type}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold">•</span>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase truncate max-w-[200px]">
                                                {courses.find(c => c._id === task.courseId)?.title || "Course"}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-[#1A1D1F] truncate group-hover:text-[#6C5DD3] transition-colors">{task.title}</h3>
                                    </div>
                                </div>

                                <div className="hidden md:flex items-center gap-8 px-4 text-sm font-medium">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Points</span>
                                        <span className="font-bold flex items-center gap-1">
                                            <Award size={14} className="text-yellow-500" />
                                            {task.points}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-center min-w-[80px]">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Deadline</span>
                                        <span className="text-xs text-gray-600 flex items-center gap-1">
                                            <Clock size={12} />
                                            {task.deadline ? format(new Date(task.deadline), 'MMM dd') : 'No date'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Submissions</span>
                                        <span className="font-bold text-[#6C5DD3] bg-[#6C5DD3]/5 px-3 py-0.5 rounded-full">
                                            0
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link 
                                        href={`/dashboard/tasks/${task._id}/submissions`}
                                        className="p-2 text-gray-400 hover:text-[#6C5DD3] hover:bg-[#6C5DD3]/5 rounded-lg transition-all"
                                        title="View Submissions"
                                    >
                                        <Users size={18} />
                                    </Link>
                                    <Link 
                                        href={`/dashboard/tasks/edit/${task._id}`}
                                        className="p-2 text-gray-400 hover:text-[#6C5DD3] hover:bg-[#6C5DD3]/5 rounded-lg transition-all"
                                        title="Edit Task"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button 
                                        onClick={() => handleDelete(task._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete Task"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white py-20 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                        <FileText size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1D1F] mb-1">No tasks created yet</h3>
                    <p className="text-sm text-gray-500 mb-8 max-w-sm">Create your first task to start assessing your students and tracking their progress.</p>
                    <Link 
                        href="/dashboard/tasks/create" 
                        className="px-8 py-3 bg-[#6C5DD3] text-white rounded-xl font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-all"
                    >
                        Get Started
                    </Link>
                </div>
            )}
        </div>
    );
}
