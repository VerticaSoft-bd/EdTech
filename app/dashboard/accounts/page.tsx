"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// ─── Types ───────────────────────────────────────────────────────
interface SummaryData {
    students: { totalReceivable: number; totalCollected: number; totalDue: number; count: number };
    payroll: { totalEmployees: number; totalPayroll: number };
    expenses: { dailyThisMonth: number; monthlyThisMonth: number; totalThisMonth: number; totalAllTime: number };
    netBalance: number;
    currentMonth: string;
}
interface EmployeeData {
    _id: string; name: string; email: string; phone: string; department: string;
    designation: string; monthlySalary: number; joinDate: string; status: string;
    employeeType: string; notes?: string;
}
interface ExpenseData {
    _id: string; title: string; amount: number; category: string; type: string;
    date: string; notes?: string; paidBy?: string;
}
interface StudentData {
    _id: string; fullName: string; email: string; courseName: string; totalCourseFee: number;
    paidAmount: number; dueAmount: number; mobileNo: string; avatar?: string;
    courseMode?: string;
}

const TABS = [
    { id: 'overview', label: 'Overview', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
    { id: 'expenses', label: 'Daily / Monthly Expenses', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id: 'employees', label: 'Employees & Payroll', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
    { id: 'dues', label: 'Course Payment and Dues', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
];
const EXPENSE_CATEGORIES = ['Rent', 'Utilities', 'Supplies', 'Marketing', 'Transport', 'Food', 'Maintenance', 'Internet', 'Salary Advance', 'Other'];

export default function AccountsPage() {
    const [user, setUser] = useState<any>(null);
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        setIsUserLoaded(true);
    }, []);

    const role = user?.role || 'admin';
    const isStaff = role === 'staff';
    const staffPermissions = user?.staffPermissions || [];
    
    // Compute permitted tabs
    const permittedTabs = React.useMemo(() => {
        if (!isUserLoaded) return [];
        return TABS.filter(tab => !isStaff || staffPermissions.includes(tab.id));
    }, [isStaff, staffPermissions, isUserLoaded]);

    useEffect(() => {
        if (isUserLoaded && permittedTabs.length > 0) {
            if (!activeTab || !permittedTabs.find(t => t.id === activeTab)) {
                setActiveTab(permittedTabs[0].id);
            }
        }
    }, [permittedTabs, activeTab, isUserLoaded]);

    // ─── OVERVIEW state ────────────────────
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [summaryLoading, setSummaryLoading] = useState(true);

    // ─── EXPENSES state ────────────────────
    const [expenses, setExpenses] = useState<ExpenseData[]>([]);
    const [expensesTotal, setExpensesTotal] = useState(0);
    const [expensesLoading, setExpensesLoading] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [expenseType, setExpenseType] = useState<'daily' | 'monthly'>('daily');

    // ─── EMPLOYEES state ────────────────────
    const [employees, setEmployees] = useState<EmployeeData[]>([]);
    const [employeesLoading, setEmployeesLoading] = useState(false);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<EmployeeData | null>(null);

    // ─── STUDENT DUES state ────────────────────
    const [students, setStudents] = useState<StudentData[]>([]);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [studentSubTab, setStudentSubTab] = useState<'dues' | 'paid'>('dues');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<StudentData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isBulkSmsLoading, setIsBulkSmsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // ─── FETCHERS ──────────────────────────
    const fetchSummary = useCallback(async () => {
        setSummaryLoading(true);
        try {
            const res = await fetch('/api/accounts/summary');
            const data = await res.json();
            if (data.success) setSummary(data.data);
        } catch { toast.error('Failed to load summary'); }
        finally { setSummaryLoading(false); }
    }, []);

    const fetchExpenses = useCallback(async (type: 'daily' | 'monthly') => {
        setExpensesLoading(true);
        try {
            const now = new Date();
            const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const res = await fetch(`/api/expenses?type=${type}&month=${month}`);
            const data = await res.json();
            if (data.success) { setExpenses(data.data); setExpensesTotal(data.total); }
        } catch { toast.error('Failed to load expenses'); }
        finally { setExpensesLoading(false); }
    }, []);

    const fetchEmployees = useCallback(async () => {
        setEmployeesLoading(true);
        try {
            const res = await fetch('/api/employees');
            const data = await res.json();
            if (data.success) setEmployees(data.data);
        } catch { toast.error('Failed to load employees'); }
        finally { setEmployeesLoading(false); }
    }, []);

    const fetchStudents = useCallback(async () => {
        setStudentsLoading(true);
        try {
            const res = await fetch('/api/students');
            const data = await res.json();
            if (data.success) setStudents(data.data);
        } catch { toast.error('Failed to load students'); }
        finally { setStudentsLoading(false); }
    }, []);

    const handleSendBulkSms = async () => {
        const studentsWithDues = students.filter(s => (s.dueAmount || 0) > 0);
        if (studentsWithDues.length === 0) {
            toast.error('No students found with outstanding dues.');
            return;
        }

        if (!confirm(`Are you sure you want to send reminder SMS to all ${studentsWithDues.length} students with dues?`)) return;

        setIsBulkSmsLoading(true);
        try {
            const res = await fetch('/api/accounts/bulk-sms-dues', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                toast.success(`Successfully sent ${data.data.success} SMS, failed ${data.data.failed}.`);
            } else {
                toast.error(data.message || 'Failed to send bulk SMS');
            }
        } catch {
            toast.error('An error occurred during bulk SMS process');
        } finally {
            setIsBulkSmsLoading(false);
        }
    };

    useEffect(() => { fetchSummary(); }, [fetchSummary]);
    useEffect(() => {
        if (activeTab === 'expenses') fetchExpenses(expenseType);
        else if (activeTab === 'employees') fetchEmployees();
        else if (activeTab === 'dues') fetchStudents();
    }, [activeTab, expenseType, fetchExpenses, fetchEmployees, fetchStudents]);

    // ─── DELETE HANDLERS ──────────────────────────
    const handleDeleteExpense = async (id: string) => {
        if (!confirm('Are you sure you want to delete this expense?')) return;
        try {
            const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) { toast.success('Expense deleted'); fetchExpenses(expenseType); fetchSummary(); }
            else toast.error(data.message);
        } catch { toast.error('Failed to delete expense'); }
    };

    const handleDeleteEmployee = async (id: string) => {
        if (!confirm('Are you sure you want to delete this employee?')) return;
        try {
            const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) { toast.success('Employee deleted'); fetchEmployees(); fetchSummary(); }
            else toast.error(data.message);
        } catch { toast.error('Failed to delete employee'); }
    };

    // ─── STUDENT FILTERING ──────────────────────────
    const filteredStudents = students.filter(s =>
        s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredBySubTab = filteredStudents.filter(s => 
        studentSubTab === 'dues' ? (s.dueAmount || 0) > 0 : (s.dueAmount || 0) <= 0
    );
    const totalPages = Math.ceil(filteredBySubTab.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentStudents = filteredBySubTab.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const overallTotal = filteredStudents.reduce((a, c) => a + (c.totalCourseFee || 0), 0);
    const overallPaid = filteredStudents.reduce((a, c) => a + (c.paidAmount || 0), 0);
    const overallDue = filteredStudents.reduce((a, c) => a + (c.dueAmount || 0), 0);

    // ───────────────────────────────────────
    // RENDER
    // ───────────────────────────────────────
    if (!isUserLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-8 h-8 border-4 border-[#6C5DD3]/20 border-t-[#6C5DD3] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-50 p-2 flex gap-1 overflow-x-auto">
                {permittedTabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-[#6C5DD3] text-white shadow-lg shadow-[#6C5DD3]/20'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-[#1A1D1F]'}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={tab.icon} /></svg>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ═══════ OVERVIEW TAB ═══════ */}
            {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    {summaryLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 animate-pulse"><div className="h-4 bg-gray-100 rounded w-2/3 mb-3"></div><div className="h-8 bg-gray-100 rounded w-1/2"></div></div>
                            ))}
                        </div>
                    ) : summary && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <MetricCard label="Total Collected" value={summary.students.totalCollected} color="green" icon="M20 6L9 17l-5-5" />
                                <MetricCard label="Total Due" value={summary.students.totalDue} color="red" icon="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                <MetricCard label="Monthly Payroll" value={summary.payroll.totalPayroll} color="purple" icon="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                <MetricCard label="Daily Expenses (This Month)" value={summary.expenses.dailyThisMonth} color="orange" icon="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                                <MetricCard label="Monthly Expenses" value={summary.expenses.monthlyThisMonth} color="blue" icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                <MetricCard label="Net Balance" value={summary.netBalance} color={summary.netBalance >= 0 ? 'green' : 'red'} icon="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" large />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
                                    <h3 className="text-lg font-bold text-[#1A1D1F] mb-4">Quick Summary — {summary.currentMonth}</h3>
                                    <div className="space-y-3">
                                        <SummaryRow label="Total Students" value={summary.students.count.toString()} />
                                        <SummaryRow label="Total Receivable" value={`৳${summary.students.totalReceivable.toLocaleString()}`} />
                                        <SummaryRow label="Total Collected" value={`৳${summary.students.totalCollected.toLocaleString()}`} color="text-green-600" />
                                        <SummaryRow label="Total Due" value={`৳${summary.students.totalDue.toLocaleString()}`} color="text-red-500" />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50">
                                    <h3 className="text-lg font-bold text-[#1A1D1F] mb-4">Office Expenditure</h3>
                                    <div className="space-y-3">
                                        <SummaryRow label="Active Employees" value={summary.payroll.totalEmployees.toString()} />
                                        <SummaryRow label="Monthly Payroll" value={`৳${summary.payroll.totalPayroll.toLocaleString()}`} color="text-[#6C5DD3]" />
                                        <SummaryRow label="Daily Expenses (This Month)" value={`৳${summary.expenses.dailyThisMonth.toLocaleString()}`} color="text-orange-500" />
                                        <SummaryRow label="Monthly Expenses" value={`৳${summary.expenses.monthlyThisMonth.toLocaleString()}`} color="text-blue-500" />
                                        <div className="border-t border-gray-100 pt-3">
                                            <SummaryRow label="Total Outflow (This Month)" value={`৳${(summary.payroll.totalPayroll + summary.expenses.totalThisMonth).toLocaleString()}`} color="text-red-500" bold />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ═══════ EXPENSES TAB (Daily / Monthly toggle) ═══════ */}
            {activeTab === 'expenses' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-50 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-[#F4F4F4] rounded-xl p-1 flex gap-1">
                                    <button onClick={() => setExpenseType('daily')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${expenseType === 'daily' ? 'bg-[#6C5DD3] text-white shadow-md' : 'text-gray-500 hover:text-[#1A1D1F]'}`}>
                                        Daily
                                    </button>
                                    <button onClick={() => setExpenseType('monthly')}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${expenseType === 'monthly' ? 'bg-[#6C5DD3] text-white shadow-md' : 'text-gray-500 hover:text-[#1A1D1F]'}`}>
                                        Monthly
                                    </button>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#1A1D1F]">{expenseType === 'daily' ? 'Daily' : 'Monthly'} Expenses</h2>
                                    <p className="text-sm text-gray-400 mt-0.5">Total this month: <span className="font-bold text-[#1A1D1F]">৳{expensesTotal.toLocaleString()}</span></p>
                                </div>
                            </div>
                            <button onClick={() => setShowExpenseModal(true)}
                                className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                Add Expense
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-50 text-[11px] uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
                                        <th className="p-4 pl-6 font-medium">Date</th>
                                        <th className="p-4 font-medium">Title</th>
                                        <th className="p-4 font-medium">Category</th>
                                        <th className="p-4 font-medium">Paid By</th>
                                        <th className="p-4 font-medium text-right">Amount</th>
                                        <th className="p-4 font-medium text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {expensesLoading ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading expenses...</td></tr>
                                    ) : expenses.length === 0 ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-gray-400">No expenses found for this month.</td></tr>
                                    ) : expenses.map(exp => (
                                        <tr key={exp._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 pl-6 text-gray-500">{new Date(exp.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                            <td className="p-4 font-bold text-[#1A1D1F]">{exp.title}{exp.notes && <p className="text-xs text-gray-400 mt-0.5">{exp.notes}</p>}</td>
                                            <td className="p-4"><span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">{exp.category}</span></td>
                                            <td className="p-4 text-gray-500">{exp.paidBy || '—'}</td>
                                            <td className="p-4 text-right font-bold text-red-500">৳{exp.amount.toLocaleString()}</td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => handleDeleteExpense(exp._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════ EMPLOYEES TAB ═══════ */}
            {activeTab === 'employees' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    {/* Payroll Summary Card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MetricCard label="Total Employees" value={employees.filter(e => e.status === 'active').length} color="blue" icon="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" isCount />
                        <MetricCard label="Monthly Payroll" value={employees.filter(e => e.status === 'active').reduce((a, e) => a + e.monthlySalary, 0)} color="purple" icon="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        <MetricCard label="Avg. Salary" value={employees.filter(e => e.status === 'active').length > 0 ? Math.round(employees.filter(e => e.status === 'active').reduce((a, e) => a + e.monthlySalary, 0) / employees.filter(e => e.status === 'active').length) : 0} color="green" icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6M15 19v-6a2 2 0 012-2h2a2 2 0 012 2v6M9 19h6" />
                    </div>

                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-50 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-[#1A1D1F]">Employee List</h2>
                            <button onClick={() => { setEditingEmployee(null); setShowEmployeeModal(true); }}
                                className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors flex items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                Add Employee
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-50 text-[11px] uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
                                        <th className="p-4 pl-6 font-medium">Name</th>
                                        <th className="p-4 font-medium">Department</th>
                                        <th className="p-4 font-medium">Designation</th>
                                        <th className="p-4 font-medium">Type</th>
                                        <th className="p-4 font-medium text-right">Salary</th>
                                        <th className="p-4 font-medium text-center">Status</th>
                                        <th className="p-4 font-medium text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {employeesLoading ? (
                                        <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading employees...</td></tr>
                                    ) : employees.length === 0 ? (
                                        <tr><td colSpan={7} className="p-8 text-center text-gray-400">No employees added yet.</td></tr>
                                    ) : employees.map(emp => (
                                        <tr key={emp._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">{emp.name?.charAt(0) || 'E'}</div>
                                                    <div>
                                                        <p className="font-bold text-[#1A1D1F]">{emp.name}</p>
                                                        <p className="text-xs text-gray-400">{emp.phone || emp.email || '—'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-[#1A1D1F]">{emp.department}</td>
                                            <td className="p-4 text-gray-500">{emp.designation || '—'}</td>
                                            <td className="p-4"><span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">{emp.employeeType}</span></td>
                                            <td className="p-4 text-right font-bold text-[#6C5DD3]">৳{emp.monthlySalary.toLocaleString()}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{emp.status}</span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button onClick={() => { setEditingEmployee(emp); setShowEmployeeModal(true); }} className="text-gray-400 hover:text-[#6C5DD3] transition-colors p-1.5 rounded-lg hover:bg-[#6C5DD3]/5">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                    </button>
                                                    <button onClick={() => handleDeleteEmployee(emp._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════ STUDENT DUES TAB ═══════ */}
            {activeTab === 'dues' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MetricCard label="Total Receivables" value={overallTotal} color="blue" icon="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        <MetricCard label="Total Collected" value={overallPaid} color="green" icon="M20 6L9 17l-5-5" />
                        <MetricCard label="Total Due" value={overallDue} color="red" icon="M12 8v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                    </div>
                    <div className="bg-white rounded-[24px] shadow-sm border border-gray-50 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-6">
                                <h2 className="text-lg font-bold text-[#1A1D1F]">Course Payments</h2>
                                <div className="bg-[#F4F4F4] rounded-xl p-1 flex gap-1">
                                    <button onClick={() => { setStudentSubTab('dues'); setCurrentPage(1); }}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${studentSubTab === 'dues' ? 'bg-[#6C5DD3] text-white shadow-md' : 'text-gray-500 hover:text-[#1A1D1F]'}`}>
                                        Dues
                                    </button>
                                    <button onClick={() => { setStudentSubTab('paid'); setCurrentPage(1); }}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${studentSubTab === 'paid' ? 'bg-[#6C5DD3] text-white shadow-md' : 'text-gray-500 hover:text-[#1A1D1F]'}`}>
                                        Fully Paid
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleSendBulkSms}
                                    disabled={isBulkSmsLoading}
                                    className={`px-4 py-2 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-all flex items-center gap-2 ${isBulkSmsLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isBulkSmsLoading ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                                    )}
                                    Send Bulk SMS
                                </button>
                                <div className="relative">
                                    <input type="text" placeholder="Search student or course..." value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                        className="pl-10 pr-4 py-2 bg-[#F4F4F4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all w-64" />
                                    <svg className="absolute left-3 top-2.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-50 text-[11px] uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50">
                                        <th className="p-4 pl-6 font-medium">Student Name</th>
                                        <th className="p-4 font-medium">Course</th>
                                        <th className="p-4 font-medium text-right">Total Fee</th>
                                        <th className="p-4 font-medium text-right">Paid Amount</th>
                                        <th className="p-4 font-medium text-right">Due Amount</th>
                                        <th className="p-4 font-medium text-center">Status</th>
                                        <th className="p-4 font-medium text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {studentsLoading ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading...</td></tr>
                                    ) : currentStudents.length === 0 ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-gray-400">No records found.</td></tr>
                                    ) : currentStudents.map((student, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white">
                                                        {student.avatar ? <img src={student.avatar} alt="" className="w-full h-full object-cover rounded-full" /> : student.fullName?.charAt(0) || 'U'}
                                                    </div>
                                                    <div><p className="font-bold text-[#1A1D1F]">{student.fullName}</p><p className="text-xs text-gray-400">{student.mobileNo}</p></div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-[#1A1D1F] font-medium">{student.courseName}</td>
                                            <td className="p-4 text-right font-bold text-gray-600">৳{(student.totalCourseFee || 0).toLocaleString()}</td>
                                            <td className="p-4 text-right font-bold text-green-600">৳{(student.paidAmount || 0).toLocaleString()}</td>
                                            <td className="p-4 text-right font-bold text-red-500">৳{(student.dueAmount || 0).toLocaleString()}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${(student.dueAmount || 0) <= 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {(student.dueAmount || 0) <= 0 ? 'Clear' : 'Due'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                {student.dueAmount > 0 && student.courseMode?.toLowerCase().includes('offline') && (
                                                    <button 
                                                        onClick={() => { setSelectedStudentForPayment(student); setShowPaymentModal(true); }}
                                                        className="px-3 py-1.5 bg-[#6C5DD3] text-white rounded-lg text-xs font-bold hover:bg-[#5a4cb5] transition-colors"
                                                    >
                                                        Pay Due
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {!studentsLoading && totalPages > 1 && (
                            <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-white text-sm">
                                <span className="text-gray-500">Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredBySubTab.length)} of {filteredBySubTab.length}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                        className={`p-2 rounded-xl transition-all ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                                    </button>
                                    {Array.from({ length: totalPages }).map((_, idx) => (
                                        <button key={idx + 1} onClick={() => setCurrentPage(idx + 1)}
                                            className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${currentPage === idx + 1 ? 'bg-[#6C5DD3] text-white shadow-lg shadow-[#6C5DD3]/20' : 'text-gray-500 hover:bg-gray-50'}`}>
                                            {idx + 1}
                                        </button>
                                    ))}
                                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                        className={`p-2 rounded-xl transition-all ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}`}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ═══════ MODALS ═══════ */}
            {showExpenseModal && (
                <ExpenseModal type={expenseType} onClose={() => setShowExpenseModal(false)} onSuccess={() => { setShowExpenseModal(false); fetchExpenses(expenseType); fetchSummary(); }} />
            )}
            {showEmployeeModal && (
                <EmployeeModal editing={editingEmployee} onClose={() => { setShowEmployeeModal(false); setEditingEmployee(null); }} onSuccess={() => { setShowEmployeeModal(false); setEditingEmployee(null); fetchEmployees(); fetchSummary(); }} />
            )}
            {showPaymentModal && selectedStudentForPayment && (
                <DuePaymentModal student={selectedStudentForPayment} onClose={() => { setShowPaymentModal(false); setSelectedStudentForPayment(null); }} onSuccess={() => { setShowPaymentModal(false); setSelectedStudentForPayment(null); fetchStudents(); fetchSummary(); }} />
            )}
        </div>
    );
}

// ═══════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════

function MetricCard({ label, value, color, icon, large, isCount }: { label: string; value: number; color: string; icon: string; large?: boolean; isCount?: boolean }) {
    const colors: Record<string, { bg: string; text: string; iconBg: string }> = {
        green: { bg: 'bg-white', text: 'text-green-600', iconBg: 'bg-green-50 text-green-600' },
        red: { bg: 'bg-white', text: 'text-red-500', iconBg: 'bg-red-50 text-red-500' },
        blue: { bg: 'bg-white', text: 'text-blue-500', iconBg: 'bg-blue-50 text-blue-500' },
        purple: { bg: 'bg-white', text: 'text-[#6C5DD3]', iconBg: 'bg-[#6C5DD3]/10 text-[#6C5DD3]' },
        orange: { bg: 'bg-white', text: 'text-orange-500', iconBg: 'bg-orange-50 text-orange-500' },
    };
    const c = colors[color] || colors.blue;
    return (
        <div className={`${c.bg} p-6 rounded-[24px] shadow-sm border border-gray-50 flex items-center justify-between ${large ? 'ring-2 ring-[#6C5DD3]/20' : ''}`}>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                <h3 className={`text-2xl font-bold ${c.text}`}>{isCount ? value : `৳${value.toLocaleString()}`}</h3>
            </div>
            <div className={`w-12 h-12 ${c.iconBg} rounded-full flex items-center justify-center`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
            </div>
        </div>
    );
}

function SummaryRow({ label, value, color, bold }: { label: string; value: string; color?: string; bold?: boolean }) {
    return (
        <div className="flex items-center justify-between">
            <span className={`text-sm ${bold ? 'font-bold text-[#1A1D1F]' : 'text-gray-500'}`}>{label}</span>
            <span className={`text-sm font-bold ${color || 'text-[#1A1D1F]'}`}>{value}</span>
        </div>
    );
}

// ─── EXPENSE MODAL ───────────────────────────────────
function ExpenseModal({ type, onClose, onSuccess }: { type: 'daily' | 'monthly'; onClose: () => void; onSuccess: () => void }) {
    const [form, setForm] = useState({ title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], notes: '', paidBy: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<string[]>(EXPENSE_CATEGORIES);
    const [newCategory, setNewCategory] = useState('');
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [mode, setMode] = useState<'expense' | 'payroll'>('expense');
    const [payrollEmployees, setPayrollEmployees] = useState<any[]>([]);
    const [payrollLoading, setPayrollLoading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [empSearch, setEmpSearch] = useState('');

    // Fetch unique categories from existing expenses
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/expenses');
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    const existing: string[] = data.data.map((e: any) => e.category);
                    const merged = [...new Set([...EXPENSE_CATEGORIES, ...existing])].sort();
                    setCategories(merged);
                }
            } catch { /* use defaults */ }
        };
        fetchCategories();
        if (type === 'monthly') {
            setPayrollLoading(true);
            fetch('/api/employees').then(r => r.json()).then(d => {
                if (d.success) setPayrollEmployees(d.data.filter((e: any) => e.status === 'active'));
            }).catch(() => { }).finally(() => setPayrollLoading(false));
        }
    }, [type]);

    const handleAddCategory = () => {
        const trimmed = newCategory.trim();
        if (trimmed && !categories.includes(trimmed)) {
            setCategories(prev => [...prev, trimmed].sort());
            setForm({ ...form, category: trimmed });
            setNewCategory('');
            setShowAddCategory(false);
            toast.success(`Category "${trimmed}" added`);
        }
    };

    const handleSelectEmployee = (emp: any) => {
        setSelectedEmployee(emp);
        setForm({ ...form, title: `Salary — ${emp.name}`, amount: emp.monthlySalary?.toString() || '0', category: 'Payroll', notes: `${emp.designation || emp.employeeType} · ${emp.department || 'General'}` });
    };

    const filteredEmps = payrollEmployees.filter(e => e.name?.toLowerCase().includes(empSearch.toLowerCase()) || e.department?.toLowerCase().includes(empSearch.toLowerCase()));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await fetch('/api/expenses', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, amount: parseFloat(form.amount), type, category: form.category || 'Other' }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            toast.success(mode === 'payroll' ? 'Salary payment recorded!' : 'Expense added!');
            onSuccess();
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-[#1A1D1F]">{mode === 'payroll' ? 'Record Salary Payment' : `Add ${type === 'daily' ? 'Daily' : 'Monthly'} Expense`}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <div className="px-6 py-6 overflow-y-auto flex-1">
                    {type === 'monthly' && (
                        <div className="mb-4">
                            <div className="bg-[#F4F4F4] rounded-xl p-1 flex gap-1">
                                <button type="button" onClick={() => { setMode('expense'); setSelectedEmployee(null); setForm({ title: '', amount: '', category: '', date: new Date().toISOString().split('T')[0], notes: '', paidBy: '' }); }}
                                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'expense' ? 'bg-[#6C5DD3] text-white shadow-md' : 'text-gray-500 hover:text-[#1A1D1F]'}`}>
                                    Expense
                                </button>
                                <button type="button" onClick={() => { setMode('payroll'); setSelectedEmployee(null); setForm({ title: '', amount: '', category: 'Payroll', date: new Date().toISOString().split('T')[0], notes: '', paidBy: '' }); }}
                                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'payroll' ? 'bg-[#6C5DD3] text-white shadow-md' : 'text-gray-500 hover:text-[#1A1D1F]'}`}>
                                    Payroll
                                </button>
                            </div>
                        </div>
                    )}
                    {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{error}</div>}

                    {mode === 'payroll' ? (
                        <>
                            {!selectedEmployee ? (
                                <div>
                                    <div className="relative mb-3">
                                        <input type="text" placeholder="Search employee..." value={empSearch} onChange={e => setEmpSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-[#F4F4F4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all" />
                                        <svg className="absolute left-3 top-3 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                    </div>
                                    {payrollLoading ? (
                                        <div className="py-6 text-center text-gray-400 text-sm">Loading employees...</div>
                                    ) : filteredEmps.length === 0 ? (
                                        <div className="py-6 text-center text-gray-400 text-sm">No employees found. Add employees in the Payroll tab first.</div>
                                    ) : (
                                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                            {filteredEmps.map(emp => (
                                                <button key={emp._id} type="button" onClick={() => handleSelectEmployee(emp)}
                                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-[#6C5DD3]/5 hover:ring-2 hover:ring-[#6C5DD3]/20">
                                                    <div className="w-10 h-10 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                                                        {emp.name?.charAt(0) || 'E'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-[#1A1D1F] text-sm truncate">{emp.name}</p>
                                                        <p className="text-xs text-gray-400 truncate">{emp.designation || emp.employeeType} · {emp.department || 'General'}</p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <p className="font-bold text-[#6C5DD3] text-sm">৳{emp.monthlySalary?.toLocaleString()}</p>
                                                        <p className="text-[10px] text-gray-400">/ month</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="p-3 bg-[#6C5DD3]/5 rounded-xl flex items-center gap-3 border border-[#6C5DD3]/10">
                                        <div className="w-10 h-10 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                                            {selectedEmployee.name?.charAt(0) || 'E'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-[#1A1D1F] text-sm">{selectedEmployee.name}</p>
                                            <p className="text-xs text-gray-400">{selectedEmployee.designation || selectedEmployee.employeeType} · {selectedEmployee.department || 'General'}</p>
                                        </div>
                                        <button type="button" onClick={() => setSelectedEmployee(null)} className="text-xs font-bold text-[#6C5DD3] hover:text-[#5a4cb5] transition-colors">Change</button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary Amount (৳) *</label>
                                        <input type="number" required min="0" step="any" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
                                            className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all resize-none" placeholder="Optional notes..." />
                                    </div>
                                    <div className="pt-2 flex justify-end gap-3">
                                        <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-[12px] font-semibold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                                        <button type="submit" disabled={loading}
                                            className="px-6 py-2.5 bg-[#6C5DD3] text-white rounded-[12px] font-semibold hover:bg-[#5b4eb3] transition-colors disabled:opacity-50 flex items-center gap-2">
                                            {loading ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>Recording...</> : 'Record Payment'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all" placeholder="e.g. Electricity Bill" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳) *</label>
                                <input type="number" required min="0" step="any" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all" placeholder="0" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <button type="button" onClick={() => setShowAddCategory(!showAddCategory)}
                                        className="text-xs font-bold text-[#6C5DD3] hover:text-[#5a4cb5] transition-colors flex items-center gap-1">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                        {showAddCategory ? 'Cancel' : 'Add New'}
                                    </button>
                                </div>
                                {showAddCategory ? (
                                    <div className="flex gap-2">
                                        <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
                                            className="flex-1 px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all"
                                            placeholder="Type new category name..." autoFocus />
                                        <button type="button" onClick={handleAddCategory}
                                            className="px-4 py-3 bg-[#6C5DD3] text-white rounded-[16px] font-semibold text-sm hover:bg-[#5b4eb3] transition-colors whitespace-nowrap">
                                            Add
                                        </button>
                                    </div>
                                ) : (
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all">
                                        <option value="">Select category</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Paid By</label>
                                <input type="text" value={form.paidBy} onChange={e => setForm({ ...form, paidBy: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all" placeholder="Who paid?" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
                                    className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all resize-none" placeholder="Optional notes..." />
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-[12px] font-semibold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                                <button type="submit" disabled={loading}
                                    className="px-6 py-2.5 bg-[#6C5DD3] text-white rounded-[12px] font-semibold hover:bg-[#5b4eb3] transition-colors disabled:opacity-50 flex items-center gap-2">
                                    {loading ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>Adding...</> : 'Add Expense'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── EMPLOYEE MODAL ───────────────────────────────────
function EmployeeModal({ editing, onClose, onSuccess }: { editing: EmployeeData | null; onClose: () => void; onSuccess: () => void }) {
    const [form, setForm] = useState({
        name: editing?.name || '', email: editing?.email || '', phone: editing?.phone || '',
        department: editing?.department || 'General', designation: editing?.designation || '',
        monthlySalary: editing?.monthlySalary?.toString() || '',
        status: editing?.status || 'active', employeeType: editing?.employeeType || 'staff', notes: editing?.notes || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ── User selection (only for ADD mode) ──
    const [users, setUsers] = useState<any[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [userSearch, setUserSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'staff' | 'admin' | 'teacher'>('all');
    const [step, setStep] = useState<'select' | 'details'>(editing ? 'details' : 'select');
    const [existingEmails, setExistingEmails] = useState<string[]>([]);

    useEffect(() => {
        if (editing) return; // skip for edit mode
        const fetchData = async () => {
            setUsersLoading(true);
            try {
                // Fetch users and existing employees in parallel
                const [usersRes, empRes] = await Promise.all([
                    fetch('/api/users'),
                    fetch('/api/employees'),
                ]);
                const usersData = await usersRes.json();
                const empData = await empRes.json();

                if (usersData.success) {
                    // Filter to only staff, admin, teacher
                    const filtered = usersData.data.filter((u: any) => ['staff', 'admin', 'teacher'].includes(u.role));
                    setUsers(filtered);
                }
                if (empData.success) {
                    setExistingEmails(empData.data.map((e: any) => e.email?.toLowerCase()).filter(Boolean));
                }
            } catch { toast.error('Failed to load users'); }
            finally { setUsersLoading(false); }
        };
        fetchData();
    }, [editing]);

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(userSearch.toLowerCase()) || u.email?.toLowerCase().includes(userSearch.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleSelectUser = (user: any) => {
        setSelectedUser(user);
        setForm({
            ...form,
            name: user.name,
            email: user.email,
            employeeType: user.role === 'admin' ? 'staff' : user.role,
        });
        setStep('details');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const url = editing ? `/api/employees/${editing._id}` : '/api/employees';
            const method = editing ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method, headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, monthlySalary: parseFloat(form.monthlySalary) }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            toast.success(editing ? 'Employee updated!' : 'Employee added to payroll!');
            onSuccess();
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[24px] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {step === 'details' && !editing && (
                            <button onClick={() => { setStep('select'); setSelectedUser(null); }} className="text-gray-400 hover:text-[#6C5DD3] transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                            </button>
                        )}
                        <h3 className="text-xl font-bold text-[#1A1D1F]">
                            {editing ? 'Edit Employee' : step === 'select' ? 'Select User' : 'Set Salary Details'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>

                {/* ── STEP 1: Select User ── */}
                {step === 'select' && (
                    <div className="px-6 py-4 overflow-y-auto flex-1">
                        {/* Search & Role Filter */}
                        <div className="flex gap-2 mb-4">
                            <div className="relative flex-1">
                                <input type="text" placeholder="Search by name or email..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#F4F4F4] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] transition-all" />
                                <svg className="absolute left-3 top-3 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            </div>
                            <div className="bg-[#F4F4F4] rounded-xl p-0.5 flex gap-0.5">
                                {(['all', 'staff', 'teacher', 'admin'] as const).map(r => (
                                    <button key={r} onClick={() => setRoleFilter(r)}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${roleFilter === r ? 'bg-[#6C5DD3] text-white shadow-sm' : 'text-gray-500 hover:text-[#1A1D1F]'}`}>
                                        {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* User List */}
                        {usersLoading ? (
                            <div className="py-8 text-center text-gray-400 text-sm">Loading users...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="py-8 text-center text-gray-400 text-sm">No users found.</div>
                        ) : (
                            <div className="space-y-2">
                                {filteredUsers.map(user => {
                                    const alreadyAdded = existingEmails.includes(user.email?.toLowerCase());
                                    return (
                                        <button key={user._id} onClick={() => !alreadyAdded && handleSelectUser(user)} disabled={alreadyAdded}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${alreadyAdded
                                                ? 'bg-gray-50 opacity-50 cursor-not-allowed'
                                                : 'hover:bg-[#6C5DD3]/5 hover:ring-2 hover:ring-[#6C5DD3]/20 cursor-pointer'}`}>
                                            <div className="w-10 h-10 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-[#1A1D1F] text-sm truncate">{user.name}</p>
                                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-700'
                                                    : user.role === 'teacher' ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-600'}`}>
                                                    {user.role}
                                                </span>
                                                {alreadyAdded && (
                                                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">Added</span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── STEP 2 / EDIT: Salary Details ── */}
                {step === 'details' && (
                    <div className="px-6 py-6 overflow-y-auto flex-1">
                        {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{error}</div>}

                        {/* Selected user banner (add mode only) */}
                        {!editing && selectedUser && (
                            <div className="mb-4 p-3 bg-[#6C5DD3]/5 rounded-xl flex items-center gap-3 border border-[#6C5DD3]/10">
                                <div className="w-10 h-10 rounded-full bg-[#6C5DD3] text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                                    {selectedUser.name?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-[#1A1D1F] text-sm">{selectedUser.name}</p>
                                    <p className="text-xs text-gray-400">{selectedUser.email} · <span className="uppercase font-bold text-[#6C5DD3]">{selectedUser.role}</span></p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {editing && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input type="text" value={form.name} readOnly
                                        className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none outline-none text-[#1A1D1F] opacity-60 cursor-not-allowed" />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary (৳) *</label>
                                <input type="number" required min="0" value={form.monthlySalary} onChange={e => setForm({ ...form, monthlySalary: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all" placeholder="Enter monthly salary" autoFocus />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input type="text" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all" placeholder="e.g. Teaching" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                                    <input type="text" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all" placeholder="e.g. Sr. Developer" />
                                </div>
                            </div>
                            {editing && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all" placeholder="Phone" />
                                    </div>
                                </div>
                            )}
                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-[12px] font-semibold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                                <button type="submit" disabled={loading}
                                    className="px-6 py-2.5 bg-[#6C5DD3] text-white rounded-[12px] font-semibold hover:bg-[#5b4eb3] transition-colors disabled:opacity-50 flex items-center gap-2">
                                    {loading ? <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>Saving...</> : editing ? 'Update Employee' : 'Add to Payroll'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- DUE PAYMENT MODAL -------------------------------
function DuePaymentModal({ student, onClose, onSuccess }: { student: StudentData; onClose: () => void; onSuccess: () => void }) {
    const [form, setForm] = useState({
        amount: student.dueAmount.toString(),
        method: 'Cash',
        description: `Due payment for ${student.fullName} - ${student.courseName}`
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(form.amount),
                    email: student.email,
                    courseName: student.courseName,
                    method: form.method,
                    description: form.description
                }),
            });
            const data = await res.json();
            if (!data.success) throw new Error(data.message);
            toast.success('Payment recorded and student record updated!');
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-[#1A1D1F]">Make Due Payment</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                </div>
                <div className="px-6 py-6 space-y-4">
                    <div className="bg-[#6C5DD3]/5 p-4 rounded-xl border border-[#6C5DD3]/10">
                        <p className="text-xs font-bold text-[#6C5DD3] uppercase tracking-wider mb-2">Student Information</p>
                        <p className="text-sm font-bold text-[#1A1D1F]">{student.fullName}</p>
                        <p className="text-xs text-gray-500 mb-2">{student.email}</p>
                        <div className="flex justify-between items-center pt-2 border-t border-[#6C5DD3]/10">
                            <span className="text-xs text-gray-500">Course:</span>
                            <span className="text-xs font-bold text-[#1A1D1F]">{student.courseName}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">Total Fee:</span>
                            <span className="text-xs font-bold text-[#1A1D1F]">৳{student.totalCourseFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">Remaining Due:</span>
                            <span className="text-xs font-bold text-red-500">৳{student.dueAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount (৳) *</label>
                            <input type="number" required min="1" max={student.dueAmount} step="any" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
                                className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all font-bold" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                            <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}
                                className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all">
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Mobile Banking">Mobile Banking (Bkash/Nagad)</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                                className="w-full px-4 py-3 bg-[#F4F4F4] rounded-[16px] border-none focus:ring-2 focus:ring-[#6C5DD3] outline-none text-[#1A1D1F] transition-all resize-none" placeholder="Notes..." />
                        </div>
                        <div className="pt-2 flex justify-end gap-3">
                            <button type="button" onClick={onClose} disabled={loading} className="px-5 py-2.5 rounded-[12px] font-semibold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
                            <button type="submit" disabled={loading}
                                className="px-6 py-2.5 bg-[#6C5DD3] text-white rounded-[12px] font-semibold hover:bg-[#5b4eb3] transition-colors disabled:opacity-50 flex items-center gap-2">
                                {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Record Payment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
