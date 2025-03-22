import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Route config option to make get request static (useful for caching)
export const dynamic = 'force-static';

export async function GET() {
  const questions = await prisma.question.findMany();
  return NextResponse.json(questions);
}

// export async function POST(req: Request) {
//   const body = await req.json();
//   const { email, name } = body;

//   if (!email || !name) {
//     return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
//   }

//   const newUser = await prisma.user.create({
//     data: { email, name },
//   });

//   return NextResponse.json(newUser, { status: 201 });
// }