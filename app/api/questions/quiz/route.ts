import { prisma } from "@/lib/prisma";
import { SingleChoiceAnswers } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  const count = await prisma.question.count();
  const skip = Math.floor(Math.random() * count);
  const questions = await prisma.question.findFirstOrThrow({
    skip: skip,
    omit: { explanation: true, hint: true },
  });

  questions.answers = (
    questions?.answers as unknown as SingleChoiceAnswers[]
  ).map(({ isCorrect: _isCorrect, ...rest }) => rest);

  function shuffleSingleChoiceAnswersArray(array: SingleChoiceAnswers[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffleSingleChoiceAnswersArray(
    questions?.answers as unknown as SingleChoiceAnswers[]
  );

  return NextResponse.json(questions);
}
