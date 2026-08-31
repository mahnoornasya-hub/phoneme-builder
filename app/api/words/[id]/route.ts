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
    const wordId = Number(id);

    if (!Number.isInteger(wordId) || wordId <= 0) {
      return NextResponse.json(
        { error: "Invalid word ID." },
        { status: 400 }
      );
    }

    const word = await prisma.word.findUnique({
      where: {
        id: wordId,
      },
      include: {
        phonemes: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!word) {
      return NextResponse.json(
        { error: "Word not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(word, { status: 200 });
  } catch (error) {
    console.error("GET /api/words/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to load word." },
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
    const wordId = Number(id);

    if (!Number.isInteger(wordId) || wordId <= 0) {
      return NextResponse.json(
        { error: "Invalid word ID." },
        { status: 400 }
      );
    }

    const existingWord = await prisma.word.findUnique({
      where: {
        id: wordId,
      },
    });

    if (!existingWord) {
      return NextResponse.json(
        { error: "Word not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const englishWord =
      typeof body.englishWord === "string"
        ? body.englishWord.trim()
        : "";

    const hint =
      typeof body.hint === "string"
        ? body.hint.trim()
        : null;

    const phonemes = body.phonemes;

    if (!englishWord) {
      return NextResponse.json(
        { error: "English word is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(phonemes) || phonemes.length === 0) {
      return NextResponse.json(
        { error: "At least one phoneme is required." },
        { status: 400 }
      );
    }

    const cleanedPhonemes = phonemes
      .filter((phoneme) => typeof phoneme === "string")
      .map((phoneme) => phoneme.trim())
      .filter((phoneme) => phoneme.length > 0);

    if (cleanedPhonemes.length === 0) {
      return NextResponse.json(
        { error: "Phonemes must contain valid text." },
        { status: 400 }
      );
    }

    const updatedWord = await prisma.$transaction(async (tx) => {
      await tx.phoneme.deleteMany({
        where: {
          wordId,
        },
      });

      return tx.word.update({
        where: {
          id: wordId,
        },
        data: {
          englishWord,
          hint: hint || null,

          phonemes: {
            create: cleanedPhonemes.map((symbol, index) => ({
              symbol,
              position: index,
            })),
          },
        },
        include: {
          phonemes: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });
    });

    return NextResponse.json(updatedWord, { status: 200 });
  } catch (error) {
    console.error("PUT /api/words/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to update word." },
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
    const wordId = Number(id);

    if (!Number.isInteger(wordId) || wordId <= 0) {
      return NextResponse.json(
        { error: "Invalid word ID." },
        { status: 400 }
      );
    }

    const existingWord = await prisma.word.findUnique({
      where: {
        id: wordId,
      },
    });

    if (!existingWord) {
      return NextResponse.json(
        { error: "Word not found." },
        { status: 404 }
      );
    }

    await prisma.word.delete({
      where: {
        id: wordId,
      },
    });

    return NextResponse.json(
      {
        message: "Word deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/words/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to delete word." },
      { status: 500 }
    );
  }
}