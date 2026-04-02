// components/cv/AccordionItem.tsx
'use client';
import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: () => void;
  headerExtras?: ReactNode;
}

export default function AccordionItem({ title, icon, children, isOpen, setIsOpen, headerExtras }: AccordionItemProps) {
  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen();
    }
  };

  return (
    <div className='border border-gray-100 rounded-[20px] overflow-hidden shadow-sm'>
      <div role='button' tabIndex={0} onClick={setIsOpen} onKeyDown={onKey} className='w-full flex justify-between items-center p-4 sm:p-5 bg-white hover:bg-[#F8FAFC] transition-colors cursor-pointer'>
        <div className='flex items-center gap-3'>
          <span className='text-[#6C5DD3] p-2 bg-[#6C5DD3]/10 rounded-xl'>{icon}</span>
          <h3 className='font-bold text-[#1A1D1F] text-[15px]'>{title}</h3>
        </div>
        <div className='flex items-center gap-2'>
          {headerExtras && (
            <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
              {headerExtras}
            </div>
          )}
          <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {isOpen && <div className='p-5 sm:p-6 border-t border-gray-100 bg-[#FAFAFA]'>{children}</div>}
    </div>
  );
}
