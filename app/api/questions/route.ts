import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-static';

export async function GET() {
  const questions = await prisma.question.findMany();
  return NextResponse.json(questions);
}