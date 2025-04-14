import { prisma } from "@/lib/prisma";
import { SingleChoiceAnswers } from "@/types";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string; type: string } }
) {
  try {
    const { id, type } = await params;
    const body = await req.json();

    const questionAnswer = await prisma.question.findUnique({
      where: { id },
      select: { answers: true },
    });

    let data;

    if (type === "SINGLE_CHOICE") {
      const foundAnswer = (
        questionAnswer?.answers as unknown as SingleChoiceAnswers[]
      )?.find((answer) => answer.text === body.text);
      data = { isCorrect: foundAnswer?.isCorrect };
    } else if (type === "MULTIPLE_CHOICE") {
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully processed quiz with ID: ${id}`,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing quiz:", error);
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
