// components/cv/CvForm.tsx
'use client';
import { CVData, Experience, SocialLink, AcademicQualification, Reference, Accomplishment, Certification, CvSectionId } from '@/types/cv';
import { PlusCircle, Trash2, User, Briefcase, GraduationCap, Award, Link as LinkIcon, Puzzle, Info, GripVertical, EyeOff, Eye, Move, Check } from 'lucide-react';
import React, { useMemo, useState, useId } from 'react';
import AccordionItem from './AccordionItem';

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Input = React.memo(({ label, id, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => {
  const autoId = useId();
  const finalId = id || autoId;
  return (
    <div className='w-full'>
      <label htmlFor={finalId} className='block text-sm font-bold text-gray-700 mb-1'>
        {label}
      </label>
      <input
        id={finalId}
        {...props}
        className='w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] text-[#1A1D1F] text-sm transition-all'
      />
    </div>
  );
});
Input.displayName = 'Input';

const Textarea = React.memo(({ label, id, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const autoId = useId();
  const finalId = id || autoId;
  return (
    <div className='w-full'>
      <label htmlFor={finalId} className='block text-sm font-bold text-gray-700 mb-1'>
        {label}
      </label>
      <textarea
        id={finalId}
        {...props}
        rows={3}
        className='w-full px-4 py-3 bg-[#F4F4F4] border border-transparent rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#6C5DD3] text-[#1A1D1F] text-sm transition-all'
      />
    </div>
  );
});
Textarea.displayName = 'Textarea';

const AddButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={onClick} className='mt-4 text-[13px] font-bold text-[#6C5DD3] hover:text-[#5b4eb3] flex items-center gap-2 cursor-pointer transition-colors'>
    <PlusCircle size={16} /> {children}
  </button>
);

type SectionDef = {
  id: CvSectionId;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

export default function CvForm({ cvData, setCvData }: { cvData: CVData; setCvData: React.Dispatch<React.SetStateAction<CVData>> }) {
  const [openAccordion, setOpenAccordion] = useState<CvSectionId | null>('personal');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);

  const handleArrayItemChange = <T extends { id: string }>(listName: keyof CVData, id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCvData((prev) => ({
      ...prev,
      [listName]: (prev[listName] as unknown as T[]).map((item) => (item.id === id ? { ...item, [name]: value } : item)),
    }));
  };

  const addArrayItem = <T extends { id: string }>(listName: keyof CVData, newItem: Omit<T, 'id'>) => {
    const itemWithId = { ...newItem, id: crypto.randomUUID() } as T;
    setCvData((prev) => ({
      ...prev,
      [listName]: [...(prev[listName] as unknown as T[]), itemWithId],
    }));
  };

  const removeArrayItem = <T extends { id: string }>(listName: keyof CVData, id: string) => {
    setCvData((prev) => ({
      ...prev,
      [listName]: (prev[listName] as unknown as T[]).filter((item) => item.id !== id),
    }));
  };

  const addStringToList = (listName: 'titles' | 'keySkills' | 'tools', value: string) => {
    if (!value.trim()) return;
    if (listName === 'titles') {
      setCvData((prev) => ({
        ...prev,
        titles: [...prev.titles, value.trim()],
      }));
    } else {
      setCvData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [listName]: [...prev.skills[listName], value.trim()],
        },
      }));
    }
  };

  const removeStringFromList = (listName: 'titles' | 'keySkills' | 'tools', index: number) => {
    if (listName === 'titles') {
      setCvData((prev) => ({
        ...prev,
        titles: prev.titles.filter((_, i) => i !== index),
      }));
    } else {
      setCvData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [listName]: prev.skills[listName].filter((_, i) => i !== index),
        },
      }));
    }
  };

  const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCvData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [name]: value,
      },
    }));
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      const MAX_KB = 200;
      if (file.size > MAX_KB * 1024) {
        setPhotoError(`Image too large. Maximum allowed size is ${MAX_KB} KB.`);
        return;
      }

      setPhotoError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await res.json();
        
        if (data.success && data.url) {
          setCvData((prev) => ({ ...prev, photoUrl: data.url }));
        } else {
          setPhotoError(data.message || 'Upload failed. Please try again.');
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Upload failed.';
        setPhotoError(errMsg);
      }
    }
  };

  const allSectionDefs: SectionDef[] = [
    {
      id: 'personal',
      title: 'Personal & Objective',
      icon: <User size={20} />,
      content: (
        <div className='space-y-4'>
          <Input label='Full Name' value={cvData.fullName} onChange={(e) => setCvData((prev) => ({ ...prev, fullName: e.target.value }))} />
          <div>
            <label className='block text-sm font-semibold text-gray-600 mb-1'>Photo (recommended: 300x300px, max: 200KB)</label>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
              <img src={cvData.photoUrl || 'https://via.placeholder.com/96'} alt='Preview' className='w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover bg-gray-200' />
              <input
                type='file'
                accept='image/*'
                onChange={handlePhotoChange}
                className='text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-gray-200 file:text-black hover:file:bg-gray-300 cursor-pointer w-full sm:w-auto'
              />
            </div>
            {photoError && <p className='text-sm text-red-600 mt-2'>{photoError}</p>}
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-600 mb-1'>Professional Titles (press Enter to add)</label>
            <input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addStringToList('titles', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className='w-full px-3 sm:px-4 py-2 bg-gray-100 rounded-md text-sm sm:text-base'
            />
            <div className='flex flex-wrap gap-2 mt-2'>
              {cvData.titles.map((t, i) => (
                <span key={i} className='flex items-center gap-1 bg-gray-200 rounded-full px-2 py-1 text-xs sm:text-sm'>
                  {t}
                  <button onClick={() => removeStringFromList('titles', i)} className='cursor-pointer'>
                    <Trash2 size={14} className='text-red-500' />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <Input label='Working Email' type='email' autoComplete='email' value={cvData.email} onChange={(e) => setCvData((prev) => ({ ...prev, email: e.target.value }))} />
          <Input label='Phone Number' type='tel' autoComplete='tel' value={cvData.phone} onChange={(e) => setCvData((prev) => ({ ...prev, phone: e.target.value }))} />
          <Input label='Address' autoComplete='street-address' value={cvData.address} onChange={(e) => setCvData((prev) => ({ ...prev, address: e.target.value }))} />
          <Textarea label='Objective' value={cvData.objective} onChange={(e) => setCvData((prev) => ({ ...prev, objective: e.target.value }))} />
        </div>
      ),
    },
    {
      id: 'socials',
      title: 'Social Links',
      icon: <LinkIcon size={20} />,
      content: (
        <div className='space-y-4'>
          {cvData.socialLinks.map((link) => (
            <div key={link.id} className='flex flex-col sm:grid sm:grid-cols-12 gap-2'>
              <div className='sm:col-span-3'>
                <label className='block text-sm font-semibold text-gray-600 mb-1'>Icon</label>
                <select
                  name='icon'
                  value={link.icon}
                  onChange={(e) => handleArrayItemChange<SocialLink>('socialLinks', link.id, e)}
                  className='w-full px-3 sm:px-4 py-2 bg-gray-100 border-transparent rounded-md cursor-pointer text-sm sm:text-base'
                >
                  <option value='linkedin'>LinkedIn</option>
                  <option value='github'>GitHub</option>
                  <option value='website'>Website</option>
                  <option value='facebook'>Facebook</option>
                  <option value='twitter'>Twitter</option>
                </select>
              </div>
              <div className='sm:col-span-4'>
                <Input label='Display Text' name='name' value={link.name} onChange={(e) => handleArrayItemChange<SocialLink>('socialLinks', link.id, e)} />
              </div>
              <div className='sm:col-span-4'>
                <Input label='URL' name='url' value={link.url} onChange={(e) => handleArrayItemChange<SocialLink>('socialLinks', link.id, e)} />
              </div>
              <div className='flex items-end sm:col-span-1'>
                <button onClick={() => removeArrayItem<SocialLink>('socialLinks', link.id)} className='w-full sm:w-auto p-2 text-red-500 h-10 cursor-pointer'>
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
          <AddButton
            onClick={() =>
              addArrayItem<SocialLink>('socialLinks', {
                name: '',
                url: '',
                icon: 'website',
              })
            }
          >
            Add Social Link
          </AddButton>
        </div>
      ),
    },
    {
      id: 'experience',
      title: 'Experience',
      icon: <Briefcase size={20} />,
      content: (
        <div className='space-y-4'>
          {cvData.experience.map((exp) => (
            <div key={exp.id} className='p-3 sm:p-4 border rounded-lg space-y-3 relative'>
              <button onClick={() => removeArrayItem<Experience>('experience', exp.id)} className='absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded-full cursor-pointer'>
                <Trash2 size={16} />
              </button>
              <Input label='Position' name='position' value={exp.position} onChange={(e) => handleArrayItemChange<Experience>('experience', exp.id, e)} />
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <Input label='Company' name='company' value={exp.company} onChange={(e) => handleArrayItemChange<Experience>('experience', exp.id, e)} />
                <Input label='Company Address' name='address' value={exp.address} onChange={(e) => handleArrayItemChange<Experience>('experience', exp.id, e)} />
                <Input label='Start Date' name='startDate' value={exp.startDate} onChange={(e) => handleArrayItemChange<Experience>('experience', exp.id, e)} />
                <Input label='End Date' name='endDate' value={exp.endDate} onChange={(e) => handleArrayItemChange<Experience>('experience', exp.id, e)} />
              </div>
              <Input label='Area of Expertise' name='expertise' value={exp.expertise} onChange={(e) => handleArrayItemChange<Experience>('experience', exp.id, e)} />
              <Textarea label='Duties / Responsibilities' name='duties' value={exp.duties} onChange={(e) => handleArrayItemChange<Experience>('experience', exp.id, e)} />
            </div>
          ))}
          <AddButton
            onClick={() =>
              addArrayItem<Experience>('experience', {
                company: '',
                address: '',
                position: '',
                expertise: '',
                startDate: '',
                endDate: '',
                duties: '',
              })
            }
          >
            Add Experience
          </AddButton>
        </div>
      ),
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: <Puzzle size={20} />,
      content: (
        <div className='space-y-6'>
          <div>
            <label className='block text-sm font-semibold text-gray-600 mb-1'>Key Skills (press Enter to add)</label>
            <input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addStringToList('keySkills', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className='w-full px-3 sm:px-4 py-2 bg-gray-100 rounded-md text-sm sm:text-base'
            />
            <div className='flex flex-wrap gap-2 mt-2'>
              {cvData.skills.keySkills.map((s, i) => (
                <span key={i} className='flex items-center gap-1 bg-gray-200 rounded-full px-2 py-1 text-xs sm:text-sm'>
                  {s}
                  <button onClick={() => removeStringFromList('keySkills', i)} className='cursor-pointer'>
                    <Trash2 size={14} className='text-red-500' />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-600 mb-1'>Tools & Technology (press Enter to add)</label>
            <input
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addStringToList('tools', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className='w-full px-3 sm:px-4 py-2 bg-gray-100 rounded-md text-sm sm:text-base'
            />
            <div className='flex flex-wrap gap-2 mt-2'>
              {cvData.skills.tools.map((s, i) => (
                <span key={i} className='flex items-center gap-1 bg-gray-200 rounded-full px-2 py-1 text-xs sm:text-sm'>
                  {s}
                  <button onClick={() => removeStringFromList('tools', i)} className='cursor-pointer'>
                    <Trash2 size={14} className='text-red-500' />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'education',
      title: 'Academic Qualification',
      icon: <GraduationCap size={20} />,
      content: (
        <div className='space-y-4'>
          {cvData.academicQualifications.map((edu) => (
            <div key={edu.id} className='flex flex-col sm:grid sm:grid-cols-12 gap-2'>
              <div className='sm:col-span-4'>
                <Input label='Institution' name='institution' value={edu.institution} onChange={(e) => handleArrayItemChange<AcademicQualification>('academicQualifications', edu.id, e)} />
              </div>
              <div className='sm:col-span-3'>
                <Input label='Degree' name='degree' value={edu.degree} onChange={(e) => handleArrayItemChange<AcademicQualification>('academicQualifications', edu.id, e)} />
              </div>
              <div className='sm:col-span-2'>
                <Input label='Year' name='graduationYear' value={edu.graduationYear} onChange={(e) => handleArrayItemChange<AcademicQualification>('academicQualifications', edu.id, e)} />
              </div>
              <div className='sm:col-span-2'>
                <Input label='Result' name='cgpa' value={edu.cgpa} onChange={(e) => handleArrayItemChange<AcademicQualification>('academicQualifications', edu.id, e)} />
              </div>
              <div className='flex items-end sm:col-span-1'>
                <button onClick={() => removeArrayItem<AcademicQualification>('academicQualifications', edu.id)} className='w-full sm:w-auto p-2 text-red-500 cursor-pointer'>
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
          <AddButton
            onClick={() =>
              addArrayItem<AcademicQualification>('academicQualifications', {
                institution: '',
                degree: '',
                graduationYear: '',
                cgpa: '',
              })
            }
          >
            Add Qualification
          </AddButton>
        </div>
      ),
    },
    {
      id: 'accomplishments',
      title: 'Honors & Accomplishments',
      icon: <Award size={20} />,
      content: (
        <div className='space-y-4'>
          {cvData.accomplishments.map((acc) => (
            <div key={acc.id} className='flex flex-col sm:grid sm:grid-cols-12 gap-2'>
              <div className='sm:col-span-5'>
                <Input label='Award / Accomplishment' name='award' value={acc.award} onChange={(e) => handleArrayItemChange<Accomplishment>('accomplishments', acc.id, e)} />
              </div>
              <div className='sm:col-span-4'>
                <Input label='Organization' name='organization' value={acc.organization} onChange={(e) => handleArrayItemChange<Accomplishment>('accomplishments', acc.id, e)} />
              </div>
              <div className='sm:col-span-2'>
                <Input label='Year' name='year' value={acc.year} onChange={(e) => handleArrayItemChange<Accomplishment>('accomplishments', acc.id, e)} />
              </div>
              <div className='flex items-end sm:col-span-1'>
                <button onClick={() => removeArrayItem<Accomplishment>('accomplishments', acc.id)} className='w-full sm:w-auto p-2 text-red-500 h-10 cursor-pointer'>
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
          <AddButton
            onClick={() =>
              addArrayItem<Accomplishment>('accomplishments', {
                award: '',
                organization: '',
                year: '',
              })
            }
          >
            Add Accomplishment
          </AddButton>
        </div>
      ),
    },
    {
      id: 'certifications',
      title: 'Training & Certifications',
      icon: <Award size={20} />,
      content: (
        <div className='space-y-4'>
          {cvData.certifications.map((cert) => (
            <div key={cert.id} className='flex flex-col sm:grid sm:grid-cols-12 gap-2'>
              <div className='sm:col-span-5'>
                <Input label='Certification Name' name='name' value={cert.name} onChange={(e) => handleArrayItemChange<Certification>('certifications', cert.id, e)} />
              </div>
              <div className='sm:col-span-5'>
                <Input label='Issuer / Organization' name='issuer' value={cert.issuer} onChange={(e) => handleArrayItemChange<Certification>('certifications', cert.id, e)} />
              </div>
              <div className='sm:col-span-1'>
                <Input label='Year' name='year' value={cert.year} onChange={(e) => handleArrayItemChange<Certification>('certifications', cert.id, e)} />
              </div>
              <div className='flex items-end sm:col-span-1'>
                <button onClick={() => removeArrayItem<Certification>('certifications', cert.id)} className='w-full sm:w-auto p-2 text-red-500 h-10 cursor-pointer' title='Remove'>
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
          <AddButton
            onClick={() =>
              addArrayItem<Certification>('certifications', {
                name: '',
                issuer: '',
                year: '',
              })
            }
          >
            Add Certification
          </AddButton>
        </div>
      ),
    },
    {
      id: 'personalDetails',
      title: 'Personal Details',
      icon: <User size={20} />,
      content: (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <Input label="Father's Name" name='fatherName' value={cvData.personalDetails.fatherName} onChange={handlePersonalDetailsChange} />
          <Input label="Mother's Name" name='motherName' value={cvData.personalDetails.motherName} onChange={handlePersonalDetailsChange} />
          <Input label='Date of Birth' name='dob' type='date' value={cvData.personalDetails.dob} onChange={handlePersonalDetailsChange} />
          <Input label='Nationality' name='nationality' value={cvData.personalDetails.nationality} onChange={handlePersonalDetailsChange} />
          <Input label='Gender' name='gender' value={cvData.personalDetails.gender} onChange={handlePersonalDetailsChange} />
          <Input label='Marital Status' name='maritalStatus' value={cvData.personalDetails.maritalStatus} onChange={handlePersonalDetailsChange} />
        </div>
      ),
    },
    {
      id: 'references',
      title: 'References',
      icon: <Info size={20} />,
      content: (
        <div className='space-y-4'>
          {cvData.references.map((ref) => (
            <div key={ref.id} className='flex flex-col sm:grid sm:grid-cols-10 gap-2'>
              <div className='sm:col-span-3'>
                <Input label='Name' name='name' value={ref.name} onChange={(e) => handleArrayItemChange<Reference>('references', ref.id, e)} />
              </div>
              <div className='sm:col-span-3'>
                <Input label='Title/Company' name='title' value={ref.title} onChange={(e) => handleArrayItemChange<Reference>('references', ref.id, e)} />
              </div>
              <div className='sm:col-span-3'>
                <Input label='Contact' name='contact' value={ref.contact} onChange={(e) => handleArrayItemChange<Reference>('references', ref.id, e)} />
              </div>
              <div className='flex items-end sm:col-span-1'>
                <button onClick={() => removeArrayItem<Reference>('references', ref.id)} className='w-full sm:w-auto p-2 text-red-500 cursor-pointer'>
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
          <AddButton
            onClick={() =>
              addArrayItem<Reference>('references', {
                name: '',
                title: '',
                contact: '',
              })
            }
          >
            Add Reference
          </AddButton>
        </div>
      ),
    },
  ];

  const effectiveOrder: CvSectionId[] = useMemo(() => {
    const knownIds = allSectionDefs.map((s) => s.id);
    const inOrderButKnown = cvData.sectionOrder.filter((id) => knownIds.includes(id));
    const missing = knownIds.filter((id) => !inOrderButKnown.includes(id));
    return [...inOrderButKnown, ...missing];
  }, [cvData.sectionOrder, allSectionDefs]);

  const hiddenSet = useMemo(() => new Set(cvData.hiddenSections), [cvData.hiddenSections]);

  const visibleSections = useMemo(
    () =>
      effectiveOrder
        .filter((id) => !hiddenSet.has(id))
        .map((id) => allSectionDefs.find((s) => s.id === id)!)
        .filter(Boolean),
    [effectiveOrder, hiddenSet, allSectionDefs]
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const fromId = active.id as CvSectionId;
    const toId = over.id as CvSectionId;

    setCvData((prev) => {
      const order = [...prev.sectionOrder];
      const fromIdx = order.indexOf(fromId);
      const toIdx = order.indexOf(toId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      order.splice(fromIdx, 1);
      order.splice(toIdx, 0, fromId);
      return { ...prev, sectionOrder: order };
    });
  };

  const hideSection = (id: CvSectionId) => {
    setCvData((prev) => {
      if (prev.hiddenSections.includes(id)) return prev;
      if (openAccordion === id) setOpenAccordion(null);
      return { ...prev, hiddenSections: [...prev.hiddenSections, id] };
    });
  };

  const showSection = (id: CvSectionId) => {
    setCvData((prev) => ({
      ...prev,
      hiddenSections: prev.hiddenSections.filter((s) => s !== id),
    }));
  };

  const ReorderRow = ({ id, title, icon }: { id: CvSectionId; title: string; icon: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <div ref={setNodeRef} style={style} className={`flex items-center justify-between p-3 border rounded-md bg-white ${isDragging ? 'opacity-70' : ''}`}>
        <div className='flex items-center gap-2'>
          <span className='text-gray-700'>{icon}</span>
          <span className='font-medium text-gray-800 text-sm sm:text-base'>{title}</span>
        </div>
        <div className='flex items-center gap-2'>
          <button {...attributes} {...listeners} className='p-1 rounded hover:bg-gray-100 text-gray-600 cursor-grab active:cursor-grabbing' title='Drag to reorder'>
            <GripVertical size={16} />
          </button>
          <button onClick={() => hideSection(id)} className='p-1 rounded hover:bg-red-50 text-red-500 cursor-pointer' title='Hide this section'>
            <EyeOff size={16} />
          </button>
        </div>
      </div>
    );
  };

  const hiddenList = allSectionDefs.map((s) => s.id).filter((id) => hiddenSet.has(id));

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-[20px] shadow-sm border border-gray-100'>
        <h3 className='text-[20px] font-bold text-[#1A1D1F]'>Edit your CV</h3>
        <button
          onClick={() => setIsReorderMode((v) => !v)}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-[12px] text-[13px] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            isReorderMode 
              ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
              : 'bg-[#6C5DD3] text-white shadow-lg shadow-[#6C5DD3]/20'
          }`}
          title={isReorderMode ? 'Done reordering' : 'Reorder sections'}
        >
          {isReorderMode ? <Check size={16} /> : <Move size={16} />}
          {isReorderMode ? 'Done' : 'Reorder sections'}
        </button>
      </div>

      {isReorderMode ? (
        <>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={visibleSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className='space-y-2'>
                {visibleSections.map((def) => (
                  <ReorderRow key={def.id} id={def.id} title={def.title} icon={def.icon} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className='mt-6'>
            <h4 className='text-sm font-semibold text-gray-600 mb-2'>Hidden sections</h4>
            {hiddenList.length === 0 ? (
              <p className='text-xs text-gray-500'>No hidden sections</p>
            ) : (
              <div className='flex flex-wrap gap-2'>
                {hiddenList.map((id) => (
                  <button
                    key={id}
                    onClick={() => showSection(id)}
                    className='text-xs px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center gap-1 cursor-pointer'
                    title='Show this section'
                  >
                    <Eye size={12} />
                    <span className='capitalize'>{id}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className='space-y-4'>
            {visibleSections.map((def) => {
              const isOpen = openAccordion === def.id;
              return (
                <AccordionItem
                  key={def.id}
                  title={def.title}
                  icon={def.icon}
                  isOpen={isOpen}
                  setIsOpen={() => setOpenAccordion(isOpen ? null : def.id)}
                  headerExtras={
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        hideSection(def.id);
                      }}
                      className='p-1 rounded hover:bg-red-50 text-red-500 cursor-pointer'
                      title='Hide this section'
                    >
                      <EyeOff size={16} />
                    </button>
                  }
                >
                  {def.content}
                </AccordionItem>
              );
            })}
          </div>

          <div className='mt-6'>
            <h4 className='text-sm font-semibold text-gray-600 mb-2'>Hidden sections</h4>
            {hiddenList.length === 0 ? (
              <p className='text-xs text-gray-500'>No hidden sections</p>
            ) : (
              <div className='flex flex-wrap gap-2'>
                {hiddenList.map((id) => (
                  <button
                    key={id}
                    onClick={() => showSection(id)}
                    className='text-xs px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 flex items-center gap-1 cursor-pointer'
                    title='Show this section'
                  >
                    <Eye size={12} />
                    <span className='capitalize'>{id}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
