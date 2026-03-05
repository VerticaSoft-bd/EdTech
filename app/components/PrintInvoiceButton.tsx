"use client";

import React, { useEffect } from 'react';

export default function PrintInvoiceButton() {
    useEffect(() => {
        // Auto-print when the page is loaded
        setTimeout(() => {
            window.print();
        }, 500);
    }, []);

    return (
        <button
            onClick={() => window.print()}
            className="mt-6 px-6 py-2 bg-[#6C5DD3] text-white font-bold rounded-lg hover:bg-[#5a4cb5] transition-colors print:hidden"
        >
            Print / Save as PDF
        </button>
    );
}
