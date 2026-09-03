import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        wordList: true,
        words: {
          include: {
            word: {
              include: {
                phonemes: {
                  orderBy: {
                    position: "asc",
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("GET /api/activities error:", error);

    return NextResponse.json(
      { error: "Failed to load activities." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const type = body.type;
    const difficulty = body.difficulty ?? "EASY";
    const instructions =
      typeof body.instructions === "string"
        ? body.instructions.trim()
        : null;

    const hint =
      typeof body.hint === "string"
        ? body.hint.trim()
        : null;

    const numberOfGuesses =
      body.numberOfGuesses === undefined
        ? null
        : Number(body.numberOfGuesses);

    const gridRows =
      body.gridRows === undefined
        ? null
        : Number(body.gridRows);

    const gridColumns =
      body.gridColumns === undefined
        ? null
        : Number(body.gridColumns);

    const showHints =
      body.showHints === undefined
        ? true
        : Boolean(body.showHints);

    const wordListId =
      body.wordListId === undefined || body.wordListId === null
        ? null
        : Number(body.wordListId);

    if (!name) {
      return NextResponse.json(
        { error: "Activity name is required." },
        { status: 400 }
      );
    }

    if (!["WORDLE", "WORD_SEARCH"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid activity type." },
        { status: 400 }
      );
    }

    if (!["EASY", "MEDIUM", "HARD"].includes(difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty." },
        { status: 400 }
      );
    }

    if (
      wordListId !== null &&
      (!Number.isInteger(wordListId) || wordListId <= 0)
    ) {
      return NextResponse.json(
        { error: "Invalid word list ID." },
        { status: 400 }
      );
    }

    if (wordListId !== null) {
      const list = await prisma.wordList.findUnique({
        where: { id: wordListId },
      });

      if (!list) {
        return NextResponse.json(
          { error: "Word list not found." },
          { status: 404 }
        );
      }
    }

    if (type === "WORDLE") {
      if (numberOfGuesses === null || numberOfGuesses <= 0) {
        return NextResponse.json(
          { error: "Wordle requires a valid number of guesses." },
          { status: 400 }
        );
      }
    }

    if (type === "WORD_SEARCH") {
      if (
        gridRows === null ||
        gridColumns === null ||
        gridRows <= 0 ||
        gridColumns <= 0
      ) {
        return NextResponse.json(
          { error: "Word Search requires valid grid dimensions." },
          { status: 400 }
        );
      }
    }

    const activity = await prisma.activity.create({
      data: {
        name,
        type,
        difficulty,
        instructions,
        hint,
        numberOfGuesses,
        gridRows,
        gridColumns,
        showHints,
        wordListId,
      },
      include: {
        wordList: true,
      },
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("POST /api/activities error:", error);

    return NextResponse.json(
      { error: "Failed to create activity." },
      { status: 500 }
    );
  }
}