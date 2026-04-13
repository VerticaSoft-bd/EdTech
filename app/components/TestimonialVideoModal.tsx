'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, VolumeX } from 'lucide-react';

interface TestimonialVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
    studentName: string;
    courseName: string;
}

export default function TestimonialVideoModal({ isOpen, onClose, videoUrl, studentName, courseName }: TestimonialVideoModalProps) {
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8"
                onClick={onClose}
            >
                {/* Close Button */}
                <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                    <X size={24} strokeWidth={2.5} />
                </motion.button>

                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-[450px] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(108,93,211,0.3)] border border-white/10 flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Video Content */}
                    <div className="relative flex-1 bg-black">
                        <video
                            src={videoUrl}
                            autoPlay
                            playsInline
                            muted={isMuted}
                            className="w-full h-full object-cover"
                            onEnded={onClose}
                        />

                        {/* Video Controls Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-8 pointer-events-none">
                            <div className="flex justify-between items-start">
                                <div className="pointer-events-auto">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-[#6C5DD3] rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        Success Story
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white pointer-events-auto border border-white/10"
                                >
                                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-2xl font-black text-white leading-tight">{studentName}</h3>
                                    <p className="text-[#6C5DD3] font-bold text-sm tracking-wide uppercase">{courseName}</p>
                                </div>
                                
                                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 15, ease: "linear" }}
                                        className="h-full bg-[#6C5DD3]"
                                    />
                                </div>

                                <p className="text-white/60 text-[11px] font-medium leading-relaxed">
                                    Member of Streva Community • Verified Review
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
                
                {/* Visual Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6C5DD3]/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
            </motion.div>
        </AnimatePresence>
    );
}
