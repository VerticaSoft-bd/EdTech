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
        <div className={`rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl transition-all hover:scale-[1.02] ${isLocked ? 'bg-gradient-to-br from-[#FF4C4C] to-[#e43b3b] shadow-[#FF4C4C]/30' : 'bg-gradient-to-br from-[#6C5DD3] to-[#8E8AFF] shadow-[#6C5DD3]/30'}`}>
            {/* Noise Texture */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                            Fee Status
                            {isLocked && <span className="bg-white/20 px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold tracking-wider">Locked</span>}
                        </h3>
                        <p className="text-xs opacity-80 font-medium">
                            {isLocked ? 'Pay immediately to unlock access' : 'Your account is active'}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/10">
                        {isLocked ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-3xl font-bold tracking-tight">{currency}{paidAmount.toLocaleString()}</span>
                        <div className="text-right">
                            <p className="text-[10px] uppercase opacity-70 font-bold">Total Fee</p>
                            <span className="text-sm font-medium">{currency}{totalFee.toLocaleString()}</span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)] ${isLocked ? 'bg-white' : 'bg-[#4BD37B]'}`}
                            style={{ width: `${percentagePaid}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider opacity-70 font-bold mb-0.5">Next Due Date</p>
                        <div className="flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <p className="text-xs font-bold">{nextDueDate}</p>
                        </div>
                    </div>
                    <button className="px-5 py-2.5 bg-white text-[#1A1D1F] rounded-xl text-xs font-bold hover:bg-opacity-90 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                        Pay Now
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeeStatusCard;
