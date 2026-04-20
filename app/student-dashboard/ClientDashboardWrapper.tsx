"use client";

import React, { useState, useEffect } from "react";
import PasswordSetupModal from "@/app/components/PasswordSetupModal";
import { useSearchParams } from "next/navigation";

interface ClientDashboardWrapperProps {
    needsPasswordSetup: boolean;
}

export default function ClientDashboardWrapper({ needsPasswordSetup: initialNeedsSetup }: ClientDashboardWrapperProps) {
    const [showModal, setShowModal] = useState(initialNeedsSetup);
    const searchParams = useSearchParams();
    const setupParam = searchParams.get('setup');

    useEffect(() => {
        if (setupParam === 'true') {
            setShowModal(true);
        } else {
            setShowModal(initialNeedsSetup);
        }
    }, [initialNeedsSetup, setupParam]);

    return (
        <PasswordSetupModal 
            isOpen={showModal} 
            onSuccess={() => setShowModal(false)} 
        />
    );
}
