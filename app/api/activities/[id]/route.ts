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
    const activityId = Number(id);

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return NextResponse.json(
        { error: "Invalid activity ID." },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
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
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(activity, { status: 200 });
  } catch (error) {
    console.error("GET /api/activities/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to load activity." },
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
    const activityId = Number(id);

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return NextResponse.json(
        { error: "Invalid activity ID." },
        { status: 400 }
      );
    }

    const existingActivity = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Activity not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const type = body.type;
    const difficulty = body.difficulty ?? "EASY";

    const instructions =
      typeof body.instructions === "string"
        ? body.instructions.trim()
        : null;

    const hint =
      typeof body.hint === "string" ? body.hint.trim() : null;

    const numberOfGuesses =
      body.numberOfGuesses === undefined ||
      body.numberOfGuesses === null
        ? null
        : Number(body.numberOfGuesses);

    const gridRows =
      body.gridRows === undefined || body.gridRows === null
        ? null
        : Number(body.gridRows);

    const gridColumns =
      body.gridColumns === undefined || body.gridColumns === null
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
      const wordList = await prisma.wordList.findUnique({
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
          { error: "Wordle requires a valid number of guesses." },
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
          { error: "Word Search requires valid grid dimensions." },
          { status: 400 }
        );
      }
    }

    const updatedActivity = await prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        name,
        type,
        difficulty,
        instructions: instructions || null,
        hint: hint || null,
        numberOfGuesses,
        gridRows,
        gridColumns,
        showHints,
        wordListId,
      },
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
    });

    return NextResponse.json(updatedActivity, { status: 200 });
  } catch (error) {
    console.error("PUT /api/activities/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to update activity." },
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
    const activityId = Number(id);

    if (!Number.isInteger(activityId) || activityId <= 0) {
      return NextResponse.json(
        { error: "Invalid activity ID." },
        { status: 400 }
      );
    }

    const existingActivity = await prisma.activity.findUnique({
      where: {
        id: activityId,
      },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Activity not found." },
        { status: 404 }
      );
    }

    await prisma.activity.delete({
      where: {
        id: activityId,
      },
    });

    return NextResponse.json(
      {
        message: "Activity deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/activities/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to delete activity." },
      { status: 500 }
    );
  }
}