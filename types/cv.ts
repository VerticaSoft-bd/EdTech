// types/cv.ts

export type SocialIconName = 'linkedin' | 'github' | 'website' | 'facebook' | 'twitter';

export type CvSectionId =
  | 'personal' // Personal & Objective
  | 'socials' // Social links (header-only in preview)
  | 'experience'
  | 'skills'
  | 'education'
  | 'accomplishments'
  | 'certifications'
  | 'personalDetails'
  | 'references';

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: SocialIconName;
}

export interface Accomplishment {
  id: string;
  award: string;
  organization: string;
  year: string;
}

export interface Experience {
  id: string;
  company: string;
  address: string;
  position: string;
  expertise: string;
  startDate: string;
  endDate: string;
  duties: string;
}

export interface AcademicQualification {
  id: string;
  institution: string;
  degree: string;
  graduationYear: string;
  cgpa: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  contact: string;
}

export interface CVData {
  userId?: string;
  photoUrl: string;
  fullName: string;
  titles: string[];
  email: string;
  phone: string;
  address: string;
  socialLinks: SocialLink[];
  objective: string;
  experience: Experience[];
  skills: {
    keySkills: string[];
    tools: string[];
  };
  accomplishments: Accomplishment[];
  academicQualifications: AcademicQualification[];
  certifications: Certification[];
  personalDetails: {
    fatherName: string;
    motherName: string;
    dob: string;
    nationality: string;
    gender: string;
    maritalStatus: string;
  };
  references: Reference[];

  // NEW: form/preview control
  sectionOrder: CvSectionId[];
  hiddenSections: CvSectionId[];
}
