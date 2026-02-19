import React from 'react';

interface FeeStatusProps {
    totalFee: number;
    paidAmount: number;
    nextDueDate: string;
    currency?: string;
}

const FeeStatusCard: React.FC<FeeStatusProps> = ({
    totalFee,
    paidAmount,
    nextDueDate,
    currency = "$"
}) => {
    const percentagePaid = Math.min(100, Math.max(0, (paidAmount / totalFee) * 100));
    const isLocked = percentagePaid < 50; // Example threshold, logically would be based on consumed classes

    return (
        <div className={`rounded-[32px] p-6 text-white relative overflow-hidden shadow-lg ${isLocked ? 'bg-gradient-to-br from-[#FF754C] to-[#FF4C4C] shadow-[#FF4C4C]/20' : 'bg-gradient-to-br from-[#4BD37B] to-[#25B058] shadow-[#4BD37B]/20'}`}>
            {/* Noise Texture */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold mb-1">Fee Status</h3>
                        <p className="text-xs opacity-80 font-medium">
                            {isLocked ? 'Payment Required to Unlock' : 'Account Active'}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-3xl font-bold">{currency}{paidAmount.toLocaleString()}</span>
                        <span className="text-sm opacity-80 mb-1">/ {currency}{totalFee.toLocaleString()}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentagePaid}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider opacity-70 font-bold mb-0.5">Next Due</p>
                        <p className="text-sm font-bold">{nextDueDate}</p>
                    </div>
                    <button className="px-4 py-2 bg-white text-[#1A1D1F] rounded-xl text-xs font-bold hover:bg-opacity-90 transition-opacity">
                        Pay Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeeStatusCard;
