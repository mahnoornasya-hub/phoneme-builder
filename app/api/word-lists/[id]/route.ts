import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const wordListId = Number(id);

    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return NextResponse.json(
        { error: "Invalid word list ID." },
        { status: 400 }
      );
    }

    const wordList = await prisma.wordList.findUnique({
      where: {
        id: wordListId,
      },
      include: {
        words: {
          include: {
            phonemes: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });

    if (!wordList) {
      return NextResponse.json(
        { error: "Word list not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(wordList, { status: 200 });
  } catch (error) {
    console.error("GET /api/word-lists/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to load word list." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const wordListId = Number(id);

    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return NextResponse.json(
        { error: "Invalid word list ID." },
        { status: 400 }
      );
    }

    const existingWordList = await prisma.wordList.findUnique({
      where: {
        id: wordListId,
      },
    });

    if (!existingWordList) {
      return NextResponse.json(
        { error: "Word list not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Word list name is required." },
        { status: 400 }
      );
    }

    const updatedWordList = await prisma.wordList.update({
      where: {
        id: wordListId,
      },
      data: {
        name,
        description: description || null,
      },
      include: {
        words: {
          include: {
            phonemes: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedWordList, { status: 200 });
  } catch (error) {
    console.error("PUT /api/word-lists/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to update word list." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const wordListId = Number(id);

    if (!Number.isInteger(wordListId) || wordListId <= 0) {
      return NextResponse.json(
        { error: "Invalid word list ID." },
        { status: 400 }
      );
    }

    const existingWordList = await prisma.wordList.findUnique({
      where: {
        id: wordListId,
      },
    });

    if (!existingWordList) {
      return NextResponse.json(
        { error: "Word list not found." },
        { status: 404 }
      );
    }

    await prisma.wordList.delete({
      where: {
        id: wordListId,
      },
    });

    return NextResponse.json(
      { message: "Word list deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/word-lists/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to delete word list." },
      { status: 500 }
    );
  }
}