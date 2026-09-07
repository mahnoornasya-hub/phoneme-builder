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

    const difficulty =
      body.difficulty ?? "EASY";

    const instructions =
      typeof body.instructions === "string" &&
      body.instructions.trim()
        ? body.instructions.trim()
        : null;

    const hint =
      typeof body.hint === "string" &&
      body.hint.trim()
        ? body.hint.trim()
        : null;

    const numberOfGuesses =
      body.numberOfGuesses === undefined ||
      body.numberOfGuesses === null
        ? null
        : Number(body.numberOfGuesses);

    const gridRows =
      body.gridRows === undefined ||
      body.gridRows === null
        ? null
        : Number(body.gridRows);

    const gridColumns =
      body.gridColumns === undefined ||
      body.gridColumns === null
        ? null
        : Number(body.gridColumns);

    const wordListId =
      body.wordListId === undefined ||
      body.wordListId === null
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

    if (
      !["EASY", "MEDIUM", "HARD"].includes(
        difficulty
      )
    ) {
      return NextResponse.json(
        { error: "Invalid difficulty." },
        { status: 400 }
      );
    }

    if (
      body.showHints !== undefined &&
      typeof body.showHints !== "boolean"
    ) {
      return NextResponse.json(
        { error: "showHints must be a boolean." },
        { status: 400 }
      );
    }

    const showHints =
      body.showHints === undefined
        ? true
        : body.showHints;

    if (
      wordListId !== null &&
      (!Number.isInteger(wordListId) ||
        wordListId <= 0)
    ) {
      return NextResponse.json(
        { error: "Invalid word list ID." },
        { status: 400 }
      );
    }

    if (wordListId !== null) {
      const wordList =
        await prisma.wordList.findUnique({
          where: {
            id: wordListId,
          },
        });

      if (!wordList) {
        return NextResponse.json(
          { error: "Word list not found." },
          { status: 404 }
        );
      }
    }

    if (type === "WORDLE") {
      if (
        numberOfGuesses === null ||
        !Number.isInteger(numberOfGuesses) ||
        numberOfGuesses <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Wordle requires a positive whole number of guesses.",
          },
          { status: 400 }
        );
      }
    }

    if (type === "WORD_SEARCH") {
      if (
        gridRows === null ||
        gridColumns === null ||
        !Number.isInteger(gridRows) ||
        !Number.isInteger(gridColumns) ||
        gridRows <= 0 ||
        gridColumns <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Word Search requires positive whole-number grid dimensions.",
          },
          { status: 400 }
        );
      }
    }

    const activity =
      await prisma.activity.create({
        data: {
          name,
          type,
          difficulty,
          instructions,
          hint,

          numberOfGuesses:
            type === "WORDLE"
              ? numberOfGuesses
              : null,

          gridRows:
            type === "WORD_SEARCH"
              ? gridRows
              : null,

          gridColumns:
            type === "WORD_SEARCH"
              ? gridColumns
              : null,

          showHints,
          wordListId,
        },
        include: {
          wordList: true,
        },
      });

    return NextResponse.json(activity, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "POST /api/activities error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to create activity." },
      { status: 500 }
    );
  }
}