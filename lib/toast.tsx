import toast from 'react-hot-toast';

export const showToast = {
    success: (message: string) => toast.success(message),
    error: (message: string) => toast.error(message),
    loading: (message: string) => toast.loading(message),
    dismiss: (id?: string) => toast.dismiss(id),
    
    confirm: (message: string, onConfirm: () => void, options?: { 
        title?: string;
        confirmText?: string; 
        cancelText?: string;
        type?: 'danger' | 'info';
    }) => {
        const { 
            title = "Are you sure?", 
            confirmText = "Confirm", 
            cancelText = "Cancel",
            type = 'info'
        } = options || {};

        toast.custom((t) => (
            <div
                className={`${
                    t.visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
                } transition-all duration-300 ease-out max-w-sm w-full bg-[#1A1D1F] shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[24px] pointer-events-auto flex flex-col border border-white/10 p-6`}
            >
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        type === 'danger' ? 'bg-[#FF4C4C]/10' : 'bg-[#6C5DD3]/10'
                    }`}>
                        {type === 'danger' ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF4C4C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C5DD3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                        )}
                    </div>
                    <div className="flex-1 pt-1">
                        <p className="text-base font-bold text-white leading-tight">{title}</p>
                        <p className="mt-2 text-sm text-gray-400 leading-relaxed font-medium">
                            {message}
                        </p>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-5 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            onConfirm();
                        }}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 ${
                            type === 'danger' 
                            ? 'bg-[#FF4C4C] hover:bg-[#e64444] text-white shadow-[#FF4C4C]/20' 
                            : 'bg-[#6C5DD3] hover:bg-[#5a4cb5] text-white shadow-[#6C5DD3]/20'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center'
        });
    }
};
