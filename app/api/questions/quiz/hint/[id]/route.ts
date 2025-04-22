import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const questionHint = await prisma.question.findUniqueOrThrow({
      where: { id },
      select: { hint: true },
    });

    return NextResponse.json(questionHint.hint);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process quiz",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
