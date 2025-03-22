// app/api/users/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET: Récupérer tous les utilisateurs
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// POST: Créer un nouvel utilisateur
export async function POST(req: Request) {
  const body = await req.json();
  const { email, name } = body;

  if (!email || !name) {
    return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
  }

  const newUser = await prisma.user.create({
    data: { email, name },
  });

  return NextResponse.json(newUser, { status: 201 });
}