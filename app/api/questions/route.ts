import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { QuestionFormValues } from "@/types";
import { auth } from "@/auth";

export async function GET() {
  const questions = await prisma.question.findMany();
  return NextResponse.json(questions);
}

export async function POST(req: Request) {
  const body: QuestionFormValues = await req.json();
  const { tags, category, answers, ...rest } = body;

  const session = await auth();

  const { id: userId } = await prisma.user.findUniqueOrThrow({
    where: { email: session?.user?.email as string },
    select: { id: true },
  });
  // console.log("userId", userId);
  // console.log("tags", tags);
  // console.log("category", category);
  // console.log("rest", rest);

  try {
    let categoryToConnect;
    if (!category.id) {
      console.log("on crée la catégorie");
      try {
        categoryToConnect = await prisma.category.create({ data: category });
      } catch (e) {
        console.error("category error", e);
        return NextResponse.json(
          { error: "Impossible to create this category" },
          { status: 400 }
        );
      }
    } else {
      categoryToConnect = await prisma.category.findUniqueOrThrow({
        where: { id: category.id },
      });
    }

    const tagsToConnect = [];
    for (const tagPointer in tags) {
      const tag = tags[tagPointer];
      // console.log(tag);
      if (!tag.id) {
        // console.log("on crée le tag");
        try {
          const newTag = await prisma.tag.create({ data: tag });
          tagsToConnect.push({ id: newTag.id });
        } catch (e) {
          console.error("tag error", e);
          return NextResponse.json(
            { error: "Impossible to create this tag" },
            { status: 400 }
          );
        }
      } else {
        const existingTag = await prisma.tag.findUniqueOrThrow({
          where: { id: tag.id },
        });
        tagsToConnect.push({ id: existingTag.id });
      }
    }

    const question = await prisma.question.create({
      data: {
        answers: JSON.stringify(answers),
        ...rest,
        categoryId: categoryToConnect.id,
        tags: {
          connect: tagsToConnect,
        },
        userId: userId,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
