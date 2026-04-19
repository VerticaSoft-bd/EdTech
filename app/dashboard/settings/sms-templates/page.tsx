'use client';

import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

interface ISmsTemplates {
    newUserStudent: string;
    newUserTeacher: string;
    forgotPasswordOtp: string;
    paymentSuccess: string;
    paymentDue: string;
    offlineStudentSignup: string;
}

interface ISiteSettings {
    _id?: string;
    smsTemplates: ISmsTemplates;
}

const DEFAULT_TEMPLATES: ISmsTemplates = {
    newUserStudent: 'Welcome [NAME]! Your account has been successfully created. Happy learning!',
    newUserTeacher: 'Welcome [NAME]! Your teacher account has been successfully created. We are excited to have you!',
    forgotPasswordOtp: 'Your OTP for password reset is [OTP]. It is valid for 10 minutes.',
    paymentSuccess: 'Hi [NAME], your payment has been successfully received. Thank you!',
    paymentDue: 'Hi [NAME], this is a reminder that you have a pending payment of [AMOUNT]. Please settle it soon.',
    offlineStudentSignup: '[NAME], setup your password [LINK] - YouthINS'
};

export default function SmsTemplatesPage() {
    const [templates, setTemplates] = useState<ISmsTemplates>(DEFAULT_TEMPLATES);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data.success && data.data.smsTemplates) {
                setTemplates({
                    ...DEFAULT_TEMPLATES,
                    ...data.data.smsTemplates
                });
            }
        } catch {
            toast.error('Failed to load SMS templates');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ smsTemplates: templates }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('SMS templates saved successfully!');
            } else {
                toast.error(data.message || 'Save failed');
            }
        } catch {
            toast.error('Error saving SMS templates');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-12 h-12 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const inputClasses = "w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all text-[#1A1D1F] min-h-[100px]";
    const labelClasses = "text-sm font-bold text-gray-700 ml-1";
    const sectionClasses = "bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100";

    const TemplateCard = ({ title, description, value, onChange, placeholder, shortcodes = ["[NAME]"] }: { 
        title: string; 
        description: string; 
        value: string; 
        onChange: (val: string) => void;
        placeholder: string;
        shortcodes?: string[];
    }) => (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <div>
                    <label className={labelClasses}>{title}</label>
                    <p className="text-xs text-gray-400 font-medium ml-1">{description}</p>
                </div>
                <div className="flex gap-2">
                    {shortcodes.map(code => (
                        <div key={code} className="px-2 py-1 bg-[#6C5DD3]/10 text-[#6C5DD3] text-[10px] font-black rounded-lg">
                            {code}
                        </div>
                    ))}
                </div>
            </div>
            <textarea 
                value={value} 
                onChange={e => onChange(e.target.value)}
                className={inputClasses}
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 px-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">SMS Templates</h1>
                    <p className="text-gray-500 font-medium text-sm">Customize automated SMS messages sent to users</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className="px-8 py-3 bg-[#6C5DD3] text-white rounded-2xl text-sm font-black shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5b4eb3] transition-all disabled:opacity-50 flex items-center gap-2">
                    {saving ? (
                        <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>SAVING...</>
                    ) : (
                        <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>SAVE TEMPLATES</>
                    )}
                </button>
            </div>

            {/* Hint Box */}
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </div>
                <div>
                    <h4 className="text-amber-900 font-bold text-sm">How to use Shortcodes</h4>
                    <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                        Use <code className="bg-amber-100 px-1.5 py-0.5 rounded font-black text-[#6C5DD3]">[NAME]</code> anywhere in your message to automatically insert the user's full name. 
                        For the OTP template, use <code className="bg-amber-100 px-1.5 py-0.5 rounded font-black text-[#6C5DD3]">[OTP]</code>.
                        For Payment Due reminders, you can use <code className="bg-amber-100 px-1.5 py-0.5 rounded font-black text-[#6C5DD3]">[AMOUNT]</code> to show the outstanding balance.
                        For Offline Signup, use <code className="bg-amber-100 px-1.5 py-0.5 rounded font-black text-[#6C5DD3]">[COURSE]</code> and <code className="bg-amber-100 px-1.5 py-0.5 rounded font-black text-[#6C5DD3]">[LINK]</code>.
                    </p>
                </div>
            </div>

            {/* Registration Templates */}
            <div className={sectionClasses}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#6C5DD3]/10 rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5DD3" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900">User Sign-up</h2>
                        <p className="text-xs text-gray-400 font-medium">Sent immediately after a new user registers</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <TemplateCard 
                        title="New Sign-up (Student)"
                        description="Welcome message for newly registered students"
                        value={templates.newUserStudent}
                        onChange={(v) => setTemplates({...templates, newUserStudent: v})}
                        placeholder="Welcome [NAME]..."
                    />
                    <TemplateCard 
                        title="New Sign-up (Teacher)"
                        description="Welcome message for newly registered teachers"
                        value={templates.newUserTeacher}
                        onChange={(v) => setTemplates({...templates, newUserTeacher: v})}
                        placeholder="Welcome [NAME]..."
                    />
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-100 max-w-xl">
                    <TemplateCard 
                        title="Offline Student Registration"
                        description="Sent to offline students with a magic login link"
                        value={templates.offlineStudentSignup}
                        onChange={(v) => setTemplates({...templates, offlineStudentSignup: v})}
                        placeholder="[NAME], setup your password..."
                        shortcodes={["[NAME]", "[COURSE]", "[LINK]"]}
                    />
                </div>
            </div>

            {/* Authentication & Security */}
            <div className={sectionClasses}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#6C5DD3]/10 rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5DD3" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Security</h2>
                        <p className="text-xs text-gray-400 font-medium">Messages related to account security and OTPs</p>
                    </div>
                </div>
                <div className="max-w-xl">
                    <div className="space-y-3">
                        <div className="flex justify-between items-end">
                            <div>
                                <label className={labelClasses}>Forgot Password OTP</label>
                                <p className="text-xs text-gray-400 font-medium ml-1">Sent when a user requests a password reset</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-2 py-1 bg-[#6C5DD3]/10 text-[#6C5DD3] text-[10px] font-black rounded-lg">
                                    [NAME]
                                </div>
                                <div className="px-2 py-1 bg-[#6C5DD3]/10 text-[#6C5DD3] text-[10px] font-black rounded-lg">
                                    [OTP]
                                </div>
                            </div>
                        </div>
                        <textarea 
                            value={templates.forgotPasswordOtp} 
                            onChange={e => setTemplates({...templates, forgotPasswordOtp: e.target.value})}
                            className={inputClasses}
                            placeholder="Your OTP is [OTP]..."
                        />
                    </div>
                </div>
            </div>

            {/* Payment Notifications */}
            <div className={sectionClasses}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#6C5DD3]/10 rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5DD3" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Payments</h2>
                        <p className="text-xs text-gray-400 font-medium">Messages sent during the billing cycle</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <TemplateCard 
                        title="Payment Success"
                        description="Confirmation message after a successful payment"
                        value={templates.paymentSuccess}
                        onChange={(v) => setTemplates({...templates, paymentSuccess: v})}
                        placeholder="Hi [NAME], your payment..."
                    />
                    <TemplateCard 
                        title="Payment Due Notification"
                        description="Reminder for students with outstanding balances"
                        value={templates.paymentDue}
                        onChange={(v) => setTemplates({...templates, paymentDue: v})}
                        placeholder="Hi [NAME], you have a pending..."
                        shortcodes={["[NAME]", "[AMOUNT]"]}
                    />
                </div>
            </div>

            {/* Bottom Save */}
            <div className="flex justify-end pt-4">
                <button onClick={handleSave} disabled={saving}
                    className="px-10 py-4 bg-[#6C5DD3] text-white rounded-2xl text-sm font-black shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5b4eb3] transition-all disabled:opacity-50 flex items-center gap-2">
                    {saving ? (
                        <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>SAVING CHANGES...</>
                    ) : (
                        <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>SAVE ALL CHANGES</>
                    )}
                </button>
            </div>
        </div>
    );
}
