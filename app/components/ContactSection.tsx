"use client";

import React, { useState, useEffect } from "react";

interface ContactSectionProps {
    initialSettings?: any;
}

const ContactSection: React.FC<ContactSectionProps> = ({ initialSettings }) => {
    const [siteSettings, setSiteSettings] = useState<any>(initialSettings || null);

    useEffect(() => {
        if (!initialSettings) {
            const fetchSettings = async () => {
                try {
                    const res = await fetch("/api/settings");
                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.data) {
                            setSiteSettings(data.data);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching settings in ContactSection:", err);
                }
            };
            fetchSettings();
        }
    }, [initialSettings]);

    return (
        <section className="w-full py-24 px-4 relative overflow-hidden bg-[#F8FAFC]">
            {/* Background Noise & Glows */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#6C5DD3]/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FF4C4C]/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row items-stretch gap-10 max-w-[1300px] mx-auto relative z-10">
                {/* Map Column (Left) */}
                <div className="w-full lg:w-[45%] group flex flex-col">
                    <div className="relative flex-1">
                        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#6C5DD3]/20 to-[#FF4C4C]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative h-full bg-white p-2 rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden flex flex-col">
                            <div className="flex-1 w-full min-h-[400px] lg:min-h-0">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9650079615135!2d90.42680589999999!3d23.748627199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9b4c1ff8911%3A0x8d70c5c554d258ee!2sYouth%20Instructory%20-%20Computer%20Training%20Center!5e0!3m2!1sen!2sbd!4v1773306370451!5m2!1sen!2sbd"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Youth Instructory Location"
                                    className="w-full h-full rounded-xl grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 ease-in-out"
                                ></iframe>
                            </div>
                            
                            {/* Map Footer Label */}
                            <div className="mt-2 px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#6C5DD3]/10 flex items-center justify-center text-[#6C5DD3]">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                    </div>
                                    <span className="text-[12px] font-bold text-gray-700">Khilgaon, Dhaka</span>
                                </div>
                                <a 
                                    href="https://maps.app.goo.gl/r6f1H1S8v9fC1Vn38" 
                                    target="_blank" 
                                    className="text-[11px] font-black text-[#6C5DD3] uppercase tracking-wider hover:underline"
                                >
                                    View Route
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Column (Right) */}
                <div className="w-full lg:w-[55%] flex flex-col">
                    <div className="bg-white p-8 md:p-14 rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.03)] border border-gray-100 relative overflow-hidden group/card flex-1 flex flex-col">
                        {/* Decorative Gradient Background */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#6C5DD3]/[0.02] via-transparent to-transparent pointer-events-none"></div>
                        
                        <div className="relative z-10 h-full flex flex-col">
                            {/* Company Branding */}
                            <div className="flex flex-col items-center gap-5 mb-12 text-center">
                                <div className="h-10 md:h-12 w-auto">
                                    <img 
                                        src={siteSettings?.logo || "/images/logo.png"} 
                                        alt="Youth Instructory Logo" 
                                        className="h-full w-auto object-contain transition-transform group-hover/card:scale-105 duration-700" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-3xl md:text-4xl font-black text-[#181C25] tracking-tight">Our Information</h2>
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="h-[1px] w-8 bg-[#6C5DD3]/20"></div>
                                        <p className="text-[12px] text-[#6C5DD3] font-bold uppercase tracking-[0.2em]">Youth Instructory Center</p>
                                        <div className="h-[1px] w-8 bg-[#6C5DD3]/20"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information Cards */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex items-start gap-4 p-6 rounded-xl border border-gray-100 bg-[#F8FAFC]/50 hover:border-[#6C5DD3]/20 hover:bg-white hover:shadow-xl hover:shadow-[#6C5DD3]/5 transition-all duration-300 col-span-1 md:col-span-2 group/contact">
                                    <div className="w-12 h-12 rounded-xl bg-[#6C5DD3]/10 flex items-center justify-center text-[#6C5DD3] group-hover/contact:bg-[#6C5DD3] group-hover/contact:text-white transition-all shrink-0">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Office Address</span>
                                        <span className="text-[15px] md:text-[17px] font-bold text-gray-800 leading-relaxed md:pr-10">৪০৩/এ, খিলগাঁও চৌরাস্তা (ফিউচার কমার্স কলেজ এর নীচতলা), ঢাকা-১২১৯</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 rounded-xl border border-gray-100 bg-[#F8FAFC]/50 hover:border-[#6C5DD3]/20 hover:bg-white hover:shadow-xl hover:shadow-[#6C5DD3]/5 transition-all duration-300 group/contact">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover/contact:bg-blue-600 group-hover/contact:text-white transition-all shrink-0">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Email Us</span>
                                        <a href={`mailto:${siteSettings?.contactEmail || 'info@youthinstructory.com'}`} className="text-[14px] md:text-[16px] font-bold text-gray-800 hover:text-[#6C5DD3] transition-colors truncate">{siteSettings?.contactEmail || 'info@youthinstructory.com'}</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-6 rounded-xl border border-gray-100 bg-[#F8FAFC]/50 hover:border-[#6C5DD3]/20 hover:bg-white hover:shadow-xl hover:shadow-[#6C5DD3]/5 transition-all duration-300 group/contact">
                                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 group-hover/contact:bg-green-600 group-hover/contact:text-white transition-all shrink-0">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">Call Us</span>
                                        <a href={`tel:${siteSettings?.contactPhone || '+880 1234 567 890'}`} className="text-[14px] md:text-[16px] font-bold text-gray-800 hover:text-[#6C5DD3] transition-colors">{siteSettings?.contactPhone || '+880 1234 567 890'}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
