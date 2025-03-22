import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { email, name, picture } = body;

  if (!email || !name) {
    return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      ...(picture && { picture }),
    },
  });

  return NextResponse.json(newUser, { status: 201 });
}