import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const questionExplanation = await prisma.question.findUniqueOrThrow({
      where: { id },
      select: { explanation: true },
    });

    return NextResponse.json(questionExplanation.explanation);
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
