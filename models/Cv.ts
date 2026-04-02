// models/Cv.ts
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { CVData } from '@/types/cv';

// Force delete the model if it exists to recompile with the new schema
if (models.Cv) {
  delete mongoose.models.Cv;
}

const SocialLinkSchema = new Schema({ name: String, url: String, icon: String }, { _id: false });
const AccomplishmentSchema = new Schema({ award: String, organization: String, year: String }, { _id: false });
const ExperienceSchema = new Schema(
  {
    company: String,
    address: String,
    position: String,
    expertise: String,
    startDate: String,
    endDate: String,
    duties: String,
  },
  { _id: false }
);
const AcademicQualificationSchema = new Schema({ institution: String, degree: String, graduationYear: String, cgpa: String }, { _id: false });
const CertificationSchema = new Schema({ name: String, issuer: String, year: String }, { _id: false });
const ReferenceSchema = new Schema({ name: String, title: String, contact: String }, { _id: false });

const SkillsSchema = new Schema(
  {
    keySkills: [{ type: String }],
    tools: [{ type: String }],
  },
  { _id: false }
);

const PersonalDetailsSchema = new Schema(
  {
    fatherName: { type: String, default: '' },
    motherName: { type: String, default: '' },
    dob: { type: String, default: '' },
    nationality: { type: String, default: '' },
    gender: { type: String, default: '' },
    maritalStatus: { type: String, default: '' },
  },
  { _id: false }
);

const DEFAULT_SECTION_ORDER = ['personal', 'experience', 'education', 'skills', 'accomplishments', 'certifications', 'personalDetails', 'references', 'socials'];

const CvSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    photoUrl: { type: String, default: '' },
    fullName: { type: String, default: '' },
    titles: [{ type: String }],
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    socialLinks: [SocialLinkSchema],
    objective: { type: String, default: '' },
    experience: [ExperienceSchema],
    skills: SkillsSchema,
    accomplishments: [AccomplishmentSchema],
    academicQualifications: [AcademicQualificationSchema],
    certifications: [CertificationSchema],
    personalDetails: PersonalDetailsSchema,
    references: [ReferenceSchema],

    // NEW
    sectionOrder: {
      type: [String],
      default: DEFAULT_SECTION_ORDER,
    },
    hiddenSections: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const CvModel: Model<CVData & Document> = mongoose.model<CVData & Document>('Cv', CvSchema);

export default CvModel;
