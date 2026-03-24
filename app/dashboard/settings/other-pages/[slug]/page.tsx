"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false }) as any;

export default function EditOtherPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const res = await fetch(`/api/settings/pages/${slug}`);
                const data = await res.json();
                if (data.success && data.data) {
                    setTitle(data.data.title || '');
                    setContent(data.data.content || '');
                } else {
                    setError('Failed to load page data');
                }
            } catch (err) {
                setError('Error fetching page data');
            } finally {
                setLoading(false);
            }
        };
        fetchPageData();
    }, [slug]);

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccessMessage('');

        if (!title) {
            setError('Please provide a title constraint');
            setSaving(false);
            return;
        }

        try {
            const res = await fetch(`/api/settings/pages/${slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });

            const data = await res.json();
            if (data.success) {
                setSuccessMessage('Page updated successfully!');
            } else {
                throw new Error(data.message || 'Failed to update page');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const editorConfig = {
        readonly: false,
        height: 400,
        placeholder: 'Start writing your content here...',
        uploader: {
            insertImageAsBase64URI: true // Simple way to allow image attachments without extra API setup initially
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 font-medium">Loading page data...</div>;
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setTitle('');
                            setContent('');
                        }}
                        className="px-5 py-2.5 bg-white border border-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2.5 bg-[#6C5DD3] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#6C5DD3]/20 hover:bg-[#5a4cb5] transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="p-4 bg-green-50 text-green-600 rounded-xl border border-green-100 text-sm font-medium">
                    {successMessage}
                </div>
            )}

            <div className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="pb-4 border-b border-gray-50">
                    <h2 className="text-xl font-bold text-[#1A1D1F] capitalize mb-1">Edit {slug.replace(/-/g, ' ')} Page</h2>
                    <p className="text-sm text-gray-500">Update the page title and content using the rich text editor below.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Page Title (পেজের শিরোনাম)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Privacy Policy"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:bg-white transition-all text-[#1A1D1F]"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Page Content (পেজের বিস্তারিত)</label>
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden" style={{ minHeight: '400px' }}>
                            <JoditEditor
                                value={content}
                                config={editorConfig}
                                onBlur={(newContent: string) => setContent(newContent)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
