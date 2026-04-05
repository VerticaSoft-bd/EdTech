'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, Info } from 'lucide-react';

interface QrCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseName: string;
    date: string;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, courseName, date }) => {
    if (!isOpen) return null;

    // Generate a secure check-in URL
    // In a real app, this would include a signed token or a short-lived session ID
    const checkInUrl = `${window.location.origin}/student/attendance/check-in?course=${encodeURIComponent(courseName)}&date=${date}`;

    const handleDownload = () => {
        const svg = document.getElementById('attendance-qr');
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `Attendance-QR-${courseName}-${date}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="relative p-8">
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6C5DD3]/10 text-[#6C5DD3] mb-4">
                            <Share2 size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-[#1A1D1F]">Scan to Check-in</h3>
                        <p className="text-sm text-gray-500 mt-2">Students can scan this code to mark their presence</p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-[24px] flex flex-col items-center justify-center border border-dashed border-gray-200">
                        <div className="bg-white p-4 rounded-2xl shadow-sm">
                            <QRCodeSVG 
                                id="attendance-qr"
                                value={checkInUrl}
                                size={200}
                                level="H"
                                includeMargin={false}
                                fgColor="#1A1D1F"
                            />
                        </div>
                        <div className="mt-6 flex flex-col items-center gap-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{courseName}</span>
                            <span className="text-sm font-bold text-[#1A1D1F]">{new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button 
                            onClick={handleDownload}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#6C5DD3] text-white rounded-2xl font-bold hover:bg-[#5a4cb5] transition-all shadow-lg shadow-[#6C5DD3]/20"
                        >
                            <Download size={18} />
                            Download QR
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-amber-50 rounded-2xl flex gap-3 border border-amber-100">
                        <Info className="text-amber-500 shrink-0" size={20} />
                        <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                            The QR code is session-specific. Students must scan this in the classroom to ensure accurate attendance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QrCodeModal;
