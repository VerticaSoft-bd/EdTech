'use client';

import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';

interface ISiteSettings {
    _id?: string;
    siteName: string;
    siteTagline: string;
    logo: string;
    favicon: string;
    primaryColor: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    footerText: string;
    socialLinks: {
        facebook: string;
        youtube: string;
        instagram: string;
        linkedin: string;
    };
}

const DEFAULT_SETTINGS: ISiteSettings = {
    siteName: 'Streva',
    siteTagline: 'Education Platform',
    logo: '/images/logo.png',
    favicon: '/favicon.ico',
    primaryColor: '#6C5DD3',
    contactEmail: '',
    contactPhone: '',
    address: '',
    footerText: '',
    socialLinks: { facebook: '', youtube: '', instagram: '', linkedin: '' },
};

export default function SettingsPage() {
    const [settings, setSettings] = useState<ISiteSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<'logo' | 'favicon' | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data.success) {
                setSettings({ ...DEFAULT_SETTINGS, ...data.data, socialLinks: { ...DEFAULT_SETTINGS.socialLinks, ...data.data?.socialLinks } });
            }
        } catch { toast.error('Failed to load settings'); }
        finally { setLoading(false); }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon') => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(field);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                setSettings(prev => ({ ...prev, [field]: data.url }));
                toast.success(`${field === 'logo' ? 'Logo' : 'Favicon'} uploaded!`);
            } else {
                toast.error(data.message || 'Upload failed');
            }
        } catch { toast.error('Error uploading file'); }
        finally { setUploading(null); }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Settings saved successfully!');
            } else {
                toast.error(data.message || 'Save failed');
            }
        } catch { toast.error('Error saving settings'); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="w-12 h-12 border-4 border-[#6C5DD3] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const inputClasses = "w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] outline-none text-sm transition-all text-[#1A1D1F]";
    const labelClasses = "text-sm font-bold text-gray-700 ml-1";
    const sectionClasses = "bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100";

    return (
        <div className="space-y-8 pb-10">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 px-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">System Settings</h1>
                    <p className="text-gray-500 font-medium text-sm">Manage your site identity, branding, and contact information</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                    className="px-8 py-3 bg-[#6C5DD3] text-white rounded-2xl text-sm font-black shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5b4eb3] transition-all disabled:opacity-50 flex items-center gap-2">
                    {saving ? (
                        <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>SAVING...</>
                    ) : (
                        <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>SAVE CHANGES</>
                    )}
                </button>
            </div>

            {/* Site Identity */}
            <div className={sectionClasses}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#6C5DD3]/10 rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5DD3" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Site Identity</h2>
                        <p className="text-xs text-gray-400 font-medium">Your brand name and tagline</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className={labelClasses}>Site Name *</label>
                        <input type="text" value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                            className={inputClasses} placeholder="e.g. Streva" />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClasses}>Tagline</label>
                        <input type="text" value={settings.siteTagline} onChange={e => setSettings({ ...settings, siteTagline: e.target.value })}
                            className={inputClasses} placeholder="e.g. Education Platform" />
                    </div>
                </div>
            </div>

            {/* Logo & Branding */}
            <div className={sectionClasses}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#6C5DD3]/10 rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5DD3" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Logo & Branding</h2>
                        <p className="text-xs text-gray-400 font-medium">Upload your logo and set brand color</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Logo Upload */}
                    <div className="space-y-3">
                        <label className={labelClasses}>Site Logo</label>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                            <div className="w-full h-24 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                                {settings.logo ? (
                                    <img src={settings.logo} alt="Logo" className="max-h-20 max-w-full object-contain" />
                                ) : (
                                    <div className="text-center">
                                        <div className="w-12 h-12 mx-auto bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 mb-2">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                        </div>
                                        <p className="text-xs text-gray-400">No logo uploaded</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="flex-1 px-4 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-xs font-bold text-center cursor-pointer hover:bg-[#5b4eb3] transition-colors">
                                    {uploading === 'logo' ? 'Uploading...' : 'Upload Logo'}
                                    <input type="file" onChange={e => handleFileUpload(e, 'logo')} className="hidden" accept="image/*" disabled={uploading === 'logo'} />
                                </label>
                                {settings.logo && (
                                    <button type="button" onClick={() => setSettings({ ...settings, logo: '' })}
                                        className="px-4 py-2.5 text-red-500 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors">Remove</button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Favicon Upload */}
                    <div className="space-y-3">
                        <label className={labelClasses}>Favicon</label>
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                            <div className="w-full h-24 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                                {settings.favicon ? (
                                    <img src={settings.favicon} alt="Favicon" className="max-h-16 max-w-full object-contain" />
                                ) : (
                                    <div className="text-center">
                                        <div className="w-12 h-12 mx-auto bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 mb-2">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                        </div>
                                        <p className="text-xs text-gray-400">No favicon uploaded</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="flex-1 px-4 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-xs font-bold text-center cursor-pointer hover:bg-[#5b4eb3] transition-colors">
                                    {uploading === 'favicon' ? 'Uploading...' : 'Upload Favicon'}
                                    <input type="file" onChange={e => handleFileUpload(e, 'favicon')} className="hidden" accept="image/*" disabled={uploading === 'favicon'} />
                                </label>
                                {settings.favicon && (
                                    <button type="button" onClick={() => setSettings({ ...settings, favicon: '' })}
                                        className="px-4 py-2.5 text-red-500 border border-red-100 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors">Remove</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Color */}
                <div className="mt-6 space-y-2">
                    <label className={labelClasses}>Primary Brand Color</label>
                    <div className="flex gap-3 max-w-sm">
                        <input type="color" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                            className="h-[52px] w-[52px] rounded-2xl border-2 border-gray-100 outline-none cursor-pointer p-1 bg-white" />
                        <input type="text" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })}
                            className={`${inputClasses} uppercase`} />
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className={sectionClasses}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#6C5DD3]/10 rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5DD3" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Contact Information</h2>
                        <p className="text-xs text-gray-400 font-medium">Displayed in footer and contact pages</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className={labelClasses}>Email Address</label>
                        <input type="email" value={settings.contactEmail} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                            className={inputClasses} placeholder="info@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClasses}>Phone Number</label>
                        <input type="text" value={settings.contactPhone} onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                            className={inputClasses} placeholder="+880 1XXX-XXXXXX" />
                    </div>
                </div>
                <div className="mt-6 space-y-2">
                    <label className={labelClasses}>Address</label>
                    <textarea value={settings.address} onChange={e => setSettings({ ...settings, address: e.target.value })} rows={2}
                        className={`${inputClasses} resize-none`} placeholder="Office address..." />
                </div>
                <div className="mt-6 space-y-2">
                    <label className={labelClasses}>Footer Text</label>
                    <input type="text" value={settings.footerText} onChange={e => setSettings({ ...settings, footerText: e.target.value })}
                        className={inputClasses} placeholder="e.g. © 2026 Streva Education. All rights reserved." />
                </div>
            </div>

            {/* Social Links */}
            <div className={sectionClasses}>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-[#6C5DD3]/10 rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C5DD3" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Social Media</h2>
                        <p className="text-xs text-gray-400 font-medium">Links shown in the footer</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className={labelClasses}>Facebook</label>
                        <input type="url" value={settings.socialLinks.facebook} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })}
                            className={inputClasses} placeholder="https://facebook.com/..." />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClasses}>YouTube</label>
                        <input type="url" value={settings.socialLinks.youtube} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, youtube: e.target.value } })}
                            className={inputClasses} placeholder="https://youtube.com/..." />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClasses}>Instagram</label>
                        <input type="url" value={settings.socialLinks.instagram} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
                            className={inputClasses} placeholder="https://instagram.com/..." />
                    </div>
                    <div className="space-y-2">
                        <label className={labelClasses}>LinkedIn</label>
                        <input type="url" value={settings.socialLinks.linkedin} onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })}
                            className={inputClasses} placeholder="https://linkedin.com/..." />
                    </div>
                </div>
            </div>

            {/* Bottom Save */}
            <div className="flex justify-end">
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
