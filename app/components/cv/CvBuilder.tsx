// components/cv/CvBuilder.tsx
'use client';
import { useState, useEffect, useRef, useDeferredValue } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { CVData, CvSectionId } from '@/types/cv';
import CvForm from './CvForm';
import CvPreview from './CvPreview';
import { Save, Download, ChevronDown, ChevronUp } from 'lucide-react';
import Spinner from '../ui/Spinner';
import { CvBuilderSkeleton } from '../ui/SkeletonLoader';

const DEFAULT_SECTION_ORDER: CvSectionId[] = ['personal', 'experience', 'education', 'skills', 'accomplishments', 'certifications', 'personalDetails', 'references', 'socials'];

const initialCvData: CVData = {
  userId: '',
  photoUrl: '',
  fullName: '',
  titles: [],
  email: '',
  phone: '',
  address: '',
  socialLinks: [],
  objective: '',
  experience: [],
  skills: { keySkills: [], tools: [] },
  certifications: [],
  accomplishments: [],
  academicQualifications: [],
  personalDetails: {
    fatherName: '',
    motherName: '',
    dob: '',
    nationality: '',
    gender: '',
    maritalStatus: '',
  },
  references: [],
  sectionOrder: DEFAULT_SECTION_ORDER,
  hiddenSections: [],
};

const cleanData = (data: Partial<CVData>): CVData => ({
  ...initialCvData,
  ...data,
  skills: {
    keySkills: Array.isArray(data.skills?.keySkills) ? data.skills.keySkills : [],
    tools: Array.isArray(data.skills?.tools) ? data.skills.tools : [],
  },
  personalDetails: {
    ...initialCvData.personalDetails,
    ...data.personalDetails,
  },
  titles: Array.isArray(data.titles) ? data.titles : [],
  socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : [],
  experience: Array.isArray(data.experience) ? data.experience : [],
  accomplishments: Array.isArray(data.accomplishments) ? data.accomplishments : [],
  academicQualifications: Array.isArray(data.academicQualifications) ? data.academicQualifications : [],
  certifications: Array.isArray(data.certifications) ? data.certifications : [],
  references: Array.isArray(data.references) ? data.references : [],
  sectionOrder: Array.isArray(data.sectionOrder) && data.sectionOrder.length ? (data.sectionOrder as CvSectionId[]) : DEFAULT_SECTION_ORDER,
  hiddenSections: Array.isArray(data.hiddenSections) ? (data.hiddenSections as CvSectionId[]) : [],
});

const stripId = <T extends { id?: unknown }>(arr: T[] = []): Array<Omit<T, 'id'>> => {
  return arr.map((item) => {
    const result: Record<string, unknown> = {};
    for (const key in item) {
      if (key !== 'id') {
        result[key] = item[key];
      }
    }
    return result as Omit<T, 'id'>;
  });
};

const serializeForApi = (data: CVData, ownerId: string) => ({
  userId: ownerId,
  photoUrl: data.photoUrl || '',
  fullName: data.fullName || '',
  titles: Array.isArray(data.titles) ? data.titles : [],
  email: data.email || '',
  phone: data.phone || '',
  address: data.address || '',
  socialLinks: stripId(data.socialLinks),
  objective: data.objective || '',
  experience: stripId(data.experience),
  skills: {
    keySkills: Array.isArray(data.skills?.keySkills) ? data.skills.keySkills : [],
    tools: Array.isArray(data.skills?.tools) ? data.skills.tools : [],
  },
  accomplishments: stripId(data.accomplishments),
  academicQualifications: stripId(data.academicQualifications),
  certifications: stripId(data.certifications),
  personalDetails: {
    fatherName: data.personalDetails?.fatherName || '',
    motherName: data.personalDetails?.motherName || '',
    dob: data.personalDetails?.dob || '',
    nationality: data.personalDetails?.nationality || '',
    gender: data.personalDetails?.gender || '',
    maritalStatus: data.personalDetails?.maritalStatus || '',
  },
  references: stripId(data.references),
  sectionOrder: Array.isArray(data.sectionOrder) && data.sectionOrder.length ? data.sectionOrder : DEFAULT_SECTION_ORDER,
  hiddenSections: Array.isArray(data.hiddenSections) ? data.hiddenSections : [],
});

async function waitForAssets(rootEl: HTMLElement) {
  const imgs = Array.from(rootEl.querySelectorAll('img'));
  await Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((res) => {
            img.onload = img.onerror = () => res();
          })
    )
  );
  const anyDoc = document as Document & { fonts?: { ready?: Promise<void> } };
  if (anyDoc.fonts && anyDoc.fonts.ready) {
    try {
      await anyDoc.fonts.ready;
    } catch {
      console.error('Font loading failed');
    }
  }
}

export default function CvBuilder() {
  const [cvData, setCvData] = useState<CVData>(initialCvData);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // For mobile toggle

  const deferredPreviewData = useDeferredValue(cvData);

  const formWrapRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const cvId = params.cvId as string | undefined;
  const userId = searchParams.get('userId');
  const cvPreviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cvId) {
      setLoading(true);
      fetch(`/api/v1/cvs/${cvId}`)
        .then((res) => res.json())
        .then((data) => {
           if (data.data) {
             setCvData(cleanData(data.data));
           } else {
             throw new Error(data.error || 'Invalid response');
           }
        })
        .catch((err) => console.error('Failed to fetch CV data:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [cvId]);

  const handleSave = async () => {
    const ownerId = (cvData.userId as string) || (userId as string | null);
    if (!ownerId) {
      alert('Could not identify the user for this CV. Please navigate from your dashboard.');
      return;
    }
    setIsSaving(true);

    const payload = serializeForApi(cvData, ownerId);
    
    try {
      const url = cvId ? `/api/v1/cvs/${cvId}` : '/api/v1/cvs';
      const method = cvId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': ownerId
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || 'Server Error');
      }
      
      router.push(`/cv/list?userId=${ownerId}`);
      router.refresh();
    } catch (error: any) {
      console.error('Failed to save CV:', error);
      alert(`Save failed: ${error.message || 'An unexpected error occurred while saving the CV.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = async () => {
    setIsDownloading(true);
    const elementToPrint = cvPreviewRef.current;
    if (!elementToPrint) {
      alert('Could not find the CV preview to print.');
      setIsDownloading(false);
      return;
    }

    await waitForAssets(elementToPrint);

    const clone = elementToPrint.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('.cv-watermark').forEach((wm) => wm.remove());

    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from((sheet as CSSStyleSheet).cssRules)
            .map((rule) => (rule as CSSRule).cssText)
            .join('\n');
        } catch {
          return '';
        }
      })
      .join('\n');

    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    if (!printWindow) {
      alert('Popup blocked! Please allow popups for this site.');
      setIsDownloading(false);
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>${cvData.fullName || 'CV'} - Print</title>
          <style>${styles}</style>
          <style>
            @page { size: A4; margin: 0; }
            html, body {
              margin: 0;
              padding: 0;
              background: #fff;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .a4-sheet {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto;
              padding: 20px;
              box-sizing: border-box;
              page-break-after: always;
              position: relative;
            }
            .a4-sheet:last-child {
              page-break-after: avoid;
            }
          </style>
        </head>
        <body>
          ${clone.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    await waitForAssets(printWindow.document.body as unknown as HTMLElement);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    printWindow.focus();
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
      setIsDownloading(false);
    };
  };

  if (loading) {
    return <CvBuilderSkeleton />;
  }

  return (
    <div className='flex flex-col lg:grid lg:grid-cols-10 min-h-screen'>
      {/* FORM SECTION */}
      <div className='w-full lg:col-span-4 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col'>
        <div
          ref={formWrapRef}
          className='flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8'
        >
          <CvForm cvData={cvData} setCvData={setCvData} />
        </div>

        {/* Action Buttons - Sticky on mobile, fixed on desktop */}
        <div className='sticky bottom-0 z-10 bg-white p-3 sm:p-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 border-t shadow-lg lg:shadow-none'>
          {/* Mobile Preview Toggle Button */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className='lg:hidden w-full sm:w-auto px-5 py-2.5 bg-[#1A1D1F] text-white rounded-[16px] font-bold flex items-center justify-center gap-2 text-[14px] transition-all'
          >
            {showPreview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={isDownloading}
            className='w-full sm:w-auto px-6 py-2.5 bg-white text-[#1A1D1F] border border-gray-200 rounded-[16px] font-bold flex items-center justify-center gap-2 text-[14px] cursor-pointer disabled:opacity-50 hover:bg-[#F4F4F4] transition-all shadow-sm'
          >
            {isDownloading ? <Spinner /> : <Download size={18} />}
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className='w-full sm:w-auto px-6 py-2.5 bg-[#6C5DD3] text-white rounded-[16px] font-bold flex items-center justify-center gap-2 text-[14px] cursor-pointer disabled:opacity-50 hover:bg-[#5b4eb3] shadow-lg shadow-[#6C5DD3]/20 transition-all'
          >
            {isSaving ? <Spinner /> : <Save size={18} />}
            <span>{cvId ? 'Update CV' : 'Save CV'}</span>
          </button>
        </div>
      </div>

      {/* PREVIEW SECTION */}
      <div
        className={`
        w-full lg:col-span-6 bg-gray-50 
        ${showPreview ? 'block' : 'hidden'} 
        lg:block 
        overflow-y-auto 
        relative
        max-h-screen
      `}
      >
        <div ref={cvPreviewRef} className='w-full'>
          <CvPreview cvData={deferredPreviewData} />
        </div>
      </div>
    </div>
  );
}
