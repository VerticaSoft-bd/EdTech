// app/api/v1/cvs/[cvId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import CvModel from '@/models/Cv';
import mongoose from 'mongoose';

type WithId<T> = T & { id?: unknown };

const stripId = <T>(arr: WithId<T>[] = []): Omit<T, 'id'>[] =>
  arr.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _unused, ...rest } = item as Record<string, unknown>;
    return rest as Omit<T, 'id'>;
  });

async function authorizeCvAccess(cvId: string, requesterId: string | null) {
  if (!requesterId || !mongoose.Types.ObjectId.isValid(cvId)) return null;
  const cv = await CvModel.findById(cvId);
  if (!cv || !cv.userId || cv.userId.toString() !== requesterId) {
    return null;
  }
  return cv;
}

export async function GET(req: NextRequest, context: { params: Promise<{ cvId: string }> }) {
  const { cvId } = await context.params;
  await connectMongo();
  try {
    const cv = await CvModel.findById(cvId);
    if (!cv) {
      return NextResponse.json({ success: false, error: 'CV not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: cv });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ cvId: string }> }) {
  const { cvId } = await context.params;
  await connectMongo();
  const userIdFromToken = req.headers.get('x-user-id');
  if (!userIdFromToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cv = await authorizeCvAccess(cvId, userIdFromToken);
    if (!cv) {
      return NextResponse.json({ error: 'CV not found or access denied' }, { status: 403 });
    }

    const body = await req.json();
    const update = {
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

      sectionOrder: Array.isArray(body.sectionOrder) ? body.sectionOrder : undefined,
      hiddenSections: Array.isArray(body.hiddenSections) ? body.hiddenSections : undefined,
    };

    const updatedCv = await CvModel.findByIdAndUpdate(cvId, update, { new: true, runValidators: true });
    return NextResponse.json({ success: true, data: updatedCv });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ cvId: string }> }) {
  const { cvId } = await context.params;
  await connectMongo();
  const userIdFromToken = req.headers.get('x-user-id');
  if (!userIdFromToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const cv = await authorizeCvAccess(cvId, userIdFromToken);
    if (!cv) {
      return NextResponse.json({ error: 'CV not found or access denied' }, { status: 403 });
    }

    await CvModel.findByIdAndDelete(cvId);
    return NextResponse.json({ success: true, data: {} });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
