// components/cv/CvPreview.tsx
'use client';
import { CVData, SocialIconName, CvSectionId } from '@/types/cv';
import { Mail, Phone, MapPin, Link as LinkIcon, Linkedin, Github, Globe, Facebook, Twitter, Briefcase, GraduationCap, Star, Award, User, Info, Puzzle } from 'lucide-react';
import React, { useState, useEffect, useRef, useMemo } from 'react';

const SectionTitle = ({ title, icon }: { title: string; icon?: React.ReactNode }) => (
  <div className='flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6 mb-2 sm:mb-3'>
    {icon && <span className='text-blue-600'>{icon}</span>}
    <h2 className='text-xs sm:text-sm font-bold uppercase text-gray-700 tracking-wider w-full pb-1 border-b-2 border-gray-200'>{title}</h2>
  </div>
);

const socialIcons: Record<SocialIconName, React.ReactNode> = {
  linkedin: <Linkedin size={12} />,
  github: <Github size={12} />,
  website: <Globe size={12} />,
  facebook: <Facebook size={12} />,
  twitter: <Twitter size={12} />,
};

const Section = ({ children }: { children: React.ReactNode }) => <section className='break-inside-avoid'>{children}</section>;

function formSectionIdToPreviewId(id: CvSectionId): string | null {
  switch (id) {
    case 'personal':
      return 'obj';
    case 'experience':
      return 'exp';
    case 'education':
      return 'edu';
    case 'skills':
      return 'skills';
    case 'accomplishments':
      return 'accomp';
    case 'certifications':
      return 'certs';
    case 'personalDetails':
      return 'pdetails';
    case 'references':
      return 'refs';
    case 'socials':
      return null;
    default:
      return null;
  }
}

const CvPreview = React.forwardRef<HTMLDivElement, { cvData: CVData }>(({ cvData }, ref) => {
  const [pages, setPages] = useState<React.ReactNode[][]>([[]]);
  const measurementRef = useRef<HTMLDivElement>(null);

  const isHidden = (id: CvSectionId) => Array.isArray(cvData.hiddenSections) && cvData.hiddenSections.includes(id);

  const sectionNodes = useMemo(() => {
    const nodes: Record<string, React.ReactNode> = {};
    const keySkills = Array.isArray(cvData.skills?.keySkills) ? cvData.skills.keySkills : [];
    const tools = Array.isArray(cvData.skills?.tools) ? cvData.skills.tools : [];

    if (!isHidden('personal') && cvData.objective) {
      nodes['obj'] = (
        <Section>
          <SectionTitle title='Objective' icon={<Star size={16} className='sm:w-[18px] sm:h-[18px]' />} />
          <p className='text-xs sm:text-sm leading-relaxed'>{cvData.objective}</p>
        </Section>
      );
    }

    if (!isHidden('experience') && cvData.experience.length > 0) {
      nodes['exp'] = (
        <Section>
          <SectionTitle title='Experience' icon={<Briefcase size={16} className='sm:w-[18px] sm:h-[18px]' />} />
          <div className='space-y-3 sm:space-y-4'>
            {cvData.experience.map((exp) => (
              <div key={exp.id} className='text-xs sm:text-sm break-inside-avoid'>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1'>
                  <h3 className='font-bold text-sm sm:text-base'>{exp.position}</h3>
                  <p className='text-xs text-gray-500'>
                    {exp.startDate} - {exp.endDate}
                  </p>
                </div>
                <p className='italic text-gray-700 text-xs sm:text-sm'>
                  {exp.company} - {exp.address}
                </p>
                <p className='text-xs mt-1'>
                  <strong>Expertise:</strong> {exp.expertise}
                </p>
                <p className='text-xs whitespace-pre-wrap mt-1'>{exp.duties}</p>
              </div>
            ))}
          </div>
        </Section>
      );
    }

    if (!isHidden('education') && cvData.academicQualifications.length > 0) {
      nodes['edu'] = (
        <Section>
          <SectionTitle title='Academic Qualification' icon={<GraduationCap size={16} className='sm:w-[18px] sm:h-[18px]' />} />
          <div className='space-y-2'>
            {cvData.academicQualifications.map((edu) => (
              <div key={edu.id} className='text-xs sm:text-sm flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 break-inside-avoid'>
                <div>
                  <h3 className='font-bold'>{edu.degree}</h3>
                  <p className='italic text-gray-700'>{edu.institution}</p>
                  {edu.cgpa && <p className='text-xs text-gray-600'>CGPA: {edu.cgpa}</p>}
                </div>
                <p className='text-xs text-gray-500'>{edu.graduationYear}</p>
              </div>
            ))}
          </div>
        </Section>
      );
    }

    if (!isHidden('skills') && (keySkills.length > 0 || tools.length > 0)) {
      nodes['skills'] = (
        <Section>
          <SectionTitle title='Skills & Abilities' icon={<Puzzle size={16} className='sm:w-[18px] sm:h-[18px]' />} />
          <div className='text-xs sm:text-sm space-y-1'>
            {keySkills.length > 0 && (
              <p>
                <strong>Key Skills:</strong> {keySkills.join(', ')}
              </p>
            )}
            {tools.length > 0 && (
              <p>
                <strong>Tools & Technology:</strong> {tools.join(', ')}
              </p>
            )}
          </div>
        </Section>
      );
    }

    if (!isHidden('accomplishments') && cvData.accomplishments.length > 0) {
      nodes['accomp'] = (
        <Section>
          <SectionTitle title='Honors & Accomplishments' icon={<Award size={16} className='sm:w-[18px] sm:h-[18px]' />} />
          <div className='space-y-2'>
            {cvData.accomplishments.map((acc) => (
              <div key={acc.id} className='text-xs sm:text-sm flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 break-inside-avoid'>
                <p>
                  <strong className='font-bold'>{acc.award}</strong>, {acc.organization}
                </p>
                <p className='text-xs text-gray-500'>{acc.year}</p>
              </div>
            ))}
          </div>
        </Section>
      );
    }

    if (!isHidden('certifications') && cvData.certifications.length > 0) {
      nodes['certs'] = (
        <Section>
          <SectionTitle title='Training & Certifications' />
          <div className='space-y-2'>
            {cvData.certifications.map((cert) => (
              <div key={cert.id} className='text-xs sm:text-sm break-inside-avoid'>
                <h3 className='font-bold'>
                  {cert.name} ({cert.year})
                </h3>
                <p className='italic text-gray-700'>{cert.issuer}</p>
              </div>
            ))}
          </div>
        </Section>
      );
    }

    if (!isHidden('personalDetails') && cvData.personalDetails.fatherName) {
      nodes['pdetails'] = (
        <Section>
          <SectionTitle title='Personal Details' icon={<User size={16} className='sm:w-[18px] sm:h-[18px]' />} />
          <div className='text-xs sm:text-sm grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-1'>
            <div>
              <strong>Father&apos;s Name:</strong> {cvData.personalDetails.fatherName}
            </div>
            <div>
              <strong>Mother&apos;s Name:</strong> {cvData.personalDetails.motherName}
            </div>
            <div>
              <strong>Date of Birth:</strong> {cvData.personalDetails.dob}
            </div>
            <div>
              <strong>Nationality:</strong> {cvData.personalDetails.nationality}
            </div>
            <div>
              <strong>Gender:</strong> {cvData.personalDetails.gender}
            </div>
            <div>
              <strong>Marital Status:</strong> {cvData.personalDetails.maritalStatus}
            </div>
          </div>
        </Section>
      );
    }

    if (!isHidden('references') && cvData.references.length > 0) {
      nodes['refs'] = (
        <Section>
          <SectionTitle title='References' icon={<Info size={16} className='sm:w-[18px] sm:h-[18px]' />} />
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {cvData.references.map((ref) => (
              <div key={ref.id} className='text-xs sm:text-sm break-inside-avoid'>
                <h3 className='font-bold'>{ref.name}</h3>
                <p className='italic text-gray-700'>{ref.title}</p>
                <p className='text-xs text-gray-600'>{ref.contact}</p>
              </div>
            ))}
          </div>
        </Section>
      );
    }

    return nodes;
  }, [cvData]);

  const orderedSections = useMemo(() => {
    const idsInOrder = (cvData.sectionOrder ?? ['personal', 'experience', 'education', 'skills', 'accomplishments', 'certifications', 'personalDetails', 'references', 'socials']) as CvSectionId[];

    const previewOrder: { id: string; element: React.ReactNode }[] = [];
    const seen = new Set<string>();

    for (const formId of idsInOrder) {
      const previewId = formSectionIdToPreviewId(formId);
      if (!previewId) continue;
      if (seen.has(previewId)) continue;
      const el = sectionNodes[previewId];
      if (el) {
        previewOrder.push({ id: previewId, element: el });
        seen.add(previewId);
      }
    }

    for (const [pid, el] of Object.entries(sectionNodes)) {
      if (!seen.has(pid)) {
        previewOrder.push({ id: pid, element: el });
      }
    }
    return previewOrder;
  }, [cvData.sectionOrder, sectionNodes]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const measure = async () => {
      if (!measurementRef.current || orderedSections.length === 0) return;

      try {
        await document.fonts?.ready;
      } catch { /* ignore */ }

      // Performance Optimization: Batch DOM reads to prevent layout thrashing
      const A4_PAGE_HEIGHT_PX = 1050;
      const headerElement = measurementRef.current.querySelector('#header-measure') as HTMLElement;
      const headerHeight = headerElement ? headerElement.offsetHeight + 20 : 0;

      // Group all measurements together
      const sectionMeasurements = orderedSections.map(section => {
        const el = measurementRef.current?.querySelector(`#measure-${section.id}`) as HTMLElement | null;
        return {
          id: section.id,
          element: section.element,
          height: el ? el.offsetHeight + 20 : 0
        };
      });

      const newPages: React.ReactNode[][] = [[]];
      let currentPageIndex = 0;
      let currentHeight = headerHeight;

      for (const meas of sectionMeasurements) {
        if (currentHeight + meas.height > A4_PAGE_HEIGHT_PX && newPages[currentPageIndex].length > 0) {
          currentPageIndex++;
          newPages[currentPageIndex] = [];
          currentHeight = 0;
        }
        newPages[currentPageIndex].push(meas.element);
        currentHeight += meas.height;
      }

      // Only update state if pages have actually changed to reduce re-renders
      setPages(prev => {
        if (JSON.stringify(prev.length) === JSON.stringify(newPages.length) && 
            prev.every((p, i) => p.length === newPages[i]?.length)) {
          return prev;
        }
        return newPages;
      });
    };

    // Debounce measurement to reduce CPU load during rapid typing
    timeoutId = setTimeout(measure, 150);

    return () => clearTimeout(timeoutId);
  }, [orderedSections]);

  const socialsHidden = isHidden('socials');

  return (
    <div ref={ref} className='w-full'>
      {/* HIDDEN: measurement container */}
      <div ref={measurementRef} className='absolute -left-[9999px] top-0 opacity-0 pointer-events-none' style={{ width: '210mm', padding: '20px' }}>
        <div className='a4-sheet' style={{ minHeight: 'auto' }}>
          <header id='header-measure' className='flex justify-between items-start mb-6'>
            <div className='w-3/4'>
              <h1 className='text-4xl font-bold text-black'>{cvData.fullName || '[Name]'}</h1>
              <p className='text-md text-gray-600 mt-1'>{cvData.titles.join(' | ')}</p>
              <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2'>
                {cvData.email && (
                  <span className='flex items-center gap-1.5'>
                    <Mail size={12} />
                    {cvData.email}
                  </span>
                )}
                {cvData.phone && (
                  <span className='flex items-center gap-1.5'>
                    <Phone size={12} />
                    {cvData.phone}
                  </span>
                )}
                {cvData.address && (
                  <span className='flex items-center gap-1.5'>
                    <MapPin size={12} />
                    {cvData.address}
                  </span>
                )}
              </div>
              {!socialsHidden && (
                <div className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-blue-600 mt-2'>
                  {cvData.socialLinks.map((link) => (
                    <a key={link.id} href={link.url} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1.5 hover:underline'>
                      {socialIcons[link.icon] || <LinkIcon size={12} />} {link.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className='w-24 h-24'></div>
          </header>
          <main>
            {orderedSections.map((section) => (
              <div key={`measure-${section.id}`} id={`measure-${section.id}`}>
                {section.element}
              </div>
            ))}
          </main>
        </div>
      </div>

      {/* VISIBLE pages - Responsive */}
      <div className='w-full max-w-full overflow-x-hidden'>
        {pages.map((pageContent, pageIndex) => (
          <div
            key={pageIndex}
            className='a4-sheet relative bg-white mx-auto my-4'
            style={{
              width: '100%',
              maxWidth: '210mm',
              minHeight: '297mm',
              padding: '12px',
            }}
          >
            <div className='cv-watermark'>
              <img src='/logo.png' alt='Watermark' className='w-16 sm:w-20 md:w-24 opacity-10' />
            </div>

            {pageIndex === 0 && (
              <header className='flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6 gap-4'>
                <div className='w-full sm:w-3/4'>
                  <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-black break-words'>{cvData.fullName || '[Name]'}</h1>
                  <p className='text-sm sm:text-base md:text-md text-gray-600 mt-1'>{cvData.titles.join(' | ')}</p>
                  <div className='flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs text-gray-500 mt-2'>
                    {cvData.email && (
                      <span className='flex items-center gap-1.5'>
                        <Mail size={10} className='sm:w-3 sm:h-3' />
                        <span className='break-all'>{cvData.email}</span>
                      </span>
                    )}
                    {cvData.phone && (
                      <span className='flex items-center gap-1.5'>
                        <Phone size={10} className='sm:w-3 sm:h-3' />
                        {cvData.phone}
                      </span>
                    )}
                    {cvData.address && (
                      <span className='flex items-center gap-1.5'>
                        <MapPin size={10} className='sm:w-3 sm:h-3' />
                        {cvData.address}
                      </span>
                    )}
                  </div>
                  {!socialsHidden && (
                    <div className='flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs text-blue-600 mt-2'>
                      {cvData.socialLinks.map((link) => (
                        <a key={link.id} href={link.url} target='_blank' rel='noopener noreferrer' className='flex items-center gap-1.5 hover:underline break-all'>
                          {socialIcons[link.icon] || <LinkIcon size={10} className='sm:w-3 sm:h-3' />} {link.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                {cvData.photoUrl && <img src={cvData.photoUrl} alt='Profile' className='w-20 h-20 sm:w-24 sm:h-24 rounded-md object-cover border' />}
              </header>
            )}
            <main className='w-full overflow-hidden'>
              {pageIndex > 0 && <div style={{ height: '20px' }} aria-hidden />}
              {pageContent}
            </main>
          </div>
        ))}
      </div>

      <footer className='text-center text-xs text-gray-500 my-4 px-4' id='cv-footer'>
        This CV is generated by Youtins & Technology by Verticasoft
      </footer>
    </div>
  );
});

CvPreview.displayName = 'CvPreview';
export default CvPreview;
