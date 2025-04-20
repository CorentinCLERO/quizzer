import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SingleChoiceAnswers } from "@/types";
import { QuestionType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string; type: QuestionType } }
) {
  try {
    const { id, type } = await params;
    const { body, asUseHint } = await req.json();
    console.log(body);

    const questionAnswer = await prisma.question.findUniqueOrThrow({
      where: { id },
      select: { answers: true },
    });

    const session = await auth();

    const { id: userId } = await prisma.user.findUniqueOrThrow({
      where: { email: session?.user?.email as string },
      select: { id: true },
    });

    let isCorrect = false;

    if (type === "SINGLE_CHOICE") {
      const foundAnswer = (
        questionAnswer.answers as unknown as SingleChoiceAnswers[]
      ).find((answer) => answer.text === body.text) as SingleChoiceAnswers;
      isCorrect = foundAnswer.isCorrect;
    } else if (type === "MULTIPLE_CHOICE") {
      // const foundAnswer = (
      //   questionAnswer.answers as unknown as SingleChoiceAnswers[]
      // ).find((answer) => answer.text === body.text) as SingleChoiceAnswers;
      isCorrect = false;
    } else if (type === "TRUE_FALSE") {
      isCorrect = false;
    } else if (type === "TEXT") {
      isCorrect = false;
    } else if (type === "MATCHING") {
      isCorrect = false;
    } else if (type === "ORDERING") {
      isCorrect = false;
    }

    await prisma.userAnswer.create({
      data: {
        userId: userId,
        questionId: id,
        answer: body,
        type,
        isCorrect: isCorrect,
        asUseHint,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Successfully processed quiz with ID: ${id}`,
        data: questionAnswer.answers,
      },
      { status: 200 }
    );
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
