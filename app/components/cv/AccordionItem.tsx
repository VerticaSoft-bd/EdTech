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
    <div className='border border-gray-200 rounded-lg overflow-hidden'>
      <div role='button' tabIndex={0} onClick={setIsOpen} onKeyDown={onKey} className='w-full flex justify-between items-center p-3 sm:p-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer'>
        <div className='flex items-center gap-2 sm:gap-3'>
          <span className='text-black'>{icon}</span>
          <h3 className='font-semibold text-gray-800 text-sm sm:text-base'>{title}</h3>
        </div>
        <div className='flex items-center gap-2'>
          {headerExtras && (
            <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
              {headerExtras}
            </div>
          )}
          <ChevronDown size={18} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {isOpen && <div className='p-3 sm:p-4 border-t border-gray-200 bg-white'>{children}</div>}
    </div>
  );
}
