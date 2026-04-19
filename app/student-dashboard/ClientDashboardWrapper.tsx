"use client";

import React, { useState, useEffect } from "react";
import PasswordSetupModal from "@/app/components/PasswordSetupModal";

interface ClientDashboardWrapperProps {
    needsPasswordSetup: boolean;
}

export default function ClientDashboardWrapper({ needsPasswordSetup: initialNeedsSetup }: ClientDashboardWrapperProps) {
    const [showModal, setShowModal] = useState(initialNeedsSetup);

    useEffect(() => {
        setShowModal(initialNeedsSetup);
    }, [initialNeedsSetup]);

    return (
        <PasswordSetupModal 
            isOpen={showModal} 
            onSuccess={() => setShowModal(false)} 
        />
    );
}
