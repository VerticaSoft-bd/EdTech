// app/api/v1/cvs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/db';
import CvModel from '../../../models/Cv';

type WithId<T> = T & { id?: unknown };

const stripId = <T>(arr: WithId<T>[] = []): Omit<T, 'id'>[] =>
  arr.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _unused, ...rest } = item as Record<string, unknown>;
    return rest as Omit<T, 'id'>;
  });

const DEFAULT_SECTION_ORDER = ['personal', 'experience', 'education', 'skills', 'accomplishments', 'certifications', 'personalDetails', 'references', 'socials'];

export async function POST(req: NextRequest) {
  await connectMongo();

  const userIdFromToken = req.headers.get('x-user-id');
  if (!userIdFromToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (body.userId && body.userId !== userIdFromToken) {
      return NextResponse.json({ error: 'Forbidden: Mismatched user ID' }, { status: 403 });
    }

    const newCvData = {
      userId: userIdFromToken,
      photoUrl: body.photoUrl || '',
      fullName: body.fullName || '',
      titles: Array.isArray(body.titles) ? body.titles : [],
      email: body.email || '',
      phone: body.phone || '',
      address: body.address || '',
      socialLinks: stripId(body.socialLinks),
      objective: body.objective || '',
      experience: stripId(body.experience),
      skills: {
        keySkills: Array.isArray(body.skills?.keySkills) ? body.skills.keySkills : [],
        tools: Array.isArray(body.skills?.tools) ? body.skills.tools : [],
      },
      accomplishments: stripId(body.accomplishments),
      academicQualifications: stripId(body.academicQualifications),
      certifications: stripId(body.certifications),
      personalDetails: {
        fatherName: body.personalDetails?.fatherName || '',
        motherName: body.personalDetails?.motherName || '',
        dob: body.personalDetails?.dob || '',
        nationality: body.personalDetails?.nationality || '',
        gender: body.personalDetails?.gender || '',
        maritalStatus: body.personalDetails?.maritalStatus || '',
      },
      references: stripId(body.references),

      sectionOrder: Array.isArray(body.sectionOrder) ? body.sectionOrder : DEFAULT_SECTION_ORDER,
      hiddenSections: Array.isArray(body.hiddenSections) ? body.hiddenSections : [],
    };

    const newCv = await CvModel.create(newCvData);
    return NextResponse.json({ success: true, data: newCv }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown server error occurred.';
    console.error('❌ [API ERROR] /api/v1/cvs POST:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
