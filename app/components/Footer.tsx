import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ContactSection from './ContactSection';
import WhatsappButton from './WhatsappButton';

export default function Footer() {
    const [siteSettings, setSiteSettings] = useState<any>(null);
    const pathname = usePathname();

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSiteSettings(data.data);
                }
            })
            .catch(err => console.error("Error fetching site settings", err));
    }, []);

    const logo = siteSettings?.logo || "/images/logo.png";
    const siteName = siteSettings?.siteName || "Streva";
    const tagline = siteSettings?.siteTagline || "Education Platform";
    const footerText = siteSettings?.footerText || `© ${new Date().getFullYear()} ${siteName} Education. All rights reserved.`;

    const isDashboard = pathname?.startsWith('/dashboard') || 
                        pathname?.startsWith('/student-dashboard') || 
                        pathname?.startsWith('/student') ||
                        pathname?.startsWith('/admin');

    return (
        <>
            {!isDashboard && <ContactSection />}
            <footer className="bg-[#1A1D1F] text-white pt-16 pb-8 border-t border-[#2A2E33]">
                <div className="max-w-[1600px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                        {/* Brand Section */}
                        <div className="col-span-1 md:col-span-1">
                            <div className="mb-6">
                                <img src={logo} alt={siteName} className="h-10 object-contain" />
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                {tagline === "Education Platform"
                                    ? "Empowering the next generation of digital creators and software engineers through smart, engaging learning journeys."
                                    : tagline}
                            </p>
                            <div className="flex items-center gap-4">
                                <a href={siteSettings?.socialLinks?.facebook || "#"} className="w-10 h-10 rounded-full bg-[#2A2E33] flex items-center justify-center hover:bg-[#6C5DD3] transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                </a>
                                <a href={siteSettings?.socialLinks?.youtube || "#"} className="w-10 h-10 rounded-full bg-[#2A2E33] flex items-center justify-center hover:bg-[#6C5DD3] transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                                </a>
                                <a href={siteSettings?.socialLinks?.instagram || "#"} className="w-10 h-10 rounded-full bg-[#2A2E33] flex items-center justify-center hover:bg-[#6C5DD3] transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </a>
                            </div>
                        </div>

                        {/* Links Section 1 */}
                        <div>
                            <h4 className="text-white font-bold mb-6">Platform</h4>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Browse Courses</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Career Paths</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Smart Tutoring</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Certificates</a></li>
                            </ul>
                        </div>

                        {/* Links Section 2 */}
                        <div>
                            <h4 className="text-white font-bold mb-6">Company</h4>
                            <ul className="space-y-4">
                                <li><Link href="/about-us" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
                                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</Link></li>
                                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
                                <li><Link href="/partners" className="text-gray-400 hover:text-white transition-colors text-sm">Partners</Link></li>
                            </ul>
                        </div>

                        {/* Newsletter Section */}
                        <div>
                            <h4 className="text-white font-bold mb-6">Subscribe</h4>
                            <p className="text-gray-400 text-sm mb-4">Get the latest course updates and educational insights.</p>
                            <div className="flex bg-[#2A2E33] rounded-xl p-1 relative overflow-hidden">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-transparent border-none text-sm text-white px-4 py-2 w-full focus:outline-none focus:ring-0"
                                />
                                <button className="bg-[#6C5DD3] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#5b4eb3] transition-colors shrink-0">
                                    Subscribe
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Bottom Footer */}
                    <div className="pt-8 border-t border-[#2A2E33] flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-500 text-sm">
                            {footerText}
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy-policy" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                            <Link href="/terms-of-service" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</Link>
                            <Link href="/cookies" className="text-gray-500 hover:text-white text-sm transition-colors">Cookies</Link>
                        </div>
                    </div>
                </div>
            </footer>
            {!isDashboard && <WhatsappButton link={siteSettings?.socialLinks?.whatsapp} />}
        </>
    );
}
