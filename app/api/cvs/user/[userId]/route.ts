// app/api/v1/cvs/user/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/db';
import CvModel from '../../../../../models/CV';

export async function GET(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  await connectMongo();

  const headerUserId = req.headers.get('x-user-id');
  const { userId: paramUserId } = await context.params;

  if (!headerUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (paramUserId && headerUserId !== paramUserId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const cvs = await CvModel.find({ userId: headerUserId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: cvs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred while fetching CVs.';
    console.error('❌ Fetch User CVs Error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}