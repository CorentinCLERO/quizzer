import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const count = await prisma.question.count();
  const skip = Math.floor(Math.random() * count);
  const questions = await prisma.question.findFirst({
    skip: skip,
  });
  return NextResponse.json(questions);
}
