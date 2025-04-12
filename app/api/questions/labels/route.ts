import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();
  return NextResponse.json({ categories, tags });
}
