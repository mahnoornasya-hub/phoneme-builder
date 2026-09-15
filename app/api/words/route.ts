import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      include: {
        wordList: true,
        phonemes: {
          orderBy: {
            position: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(words, { status: 200 });
  } catch (error) {
    console.error("GET /api/words error:", error);

    return NextResponse.json(
      {
        error: "Failed to load words.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const wordListId =
      body.wordListId === null || body.wordListId === undefined
        ? null
        : Number(body.wordListId);

    if (!englishWord) {
      return NextResponse.json(
        {
          error: "English word is required.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(phonemes) || phonemes.length === 0) {
      return NextResponse.json(
        {
          error: "At least one phoneme is required.",
        },
        { status: 400 }
      );
    }

    const cleanedPhonemes = phonemes
      .filter((phoneme) => typeof phoneme === "string")
      .map((phoneme) => phoneme.trim())
      .filter((phoneme) => phoneme.length > 0);

    if (cleanedPhonemes.length === 0) {
      return NextResponse.json(
        {
          error: "Phonemes must contain valid text.",
        },
        { status: 400 }
      );
    }

    if (
      wordListId !== null &&
      (!Number.isInteger(wordListId) || wordListId <= 0)
    ) {
      return NextResponse.json(
        {
          error: "Invalid word list ID.",
        },
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
          {
            error: "Word list not found.",
          },
          { status: 404 }
        );
      }
    }

    const word = await prisma.word.create({
      data: {
        englishWord,
        hint: hint || null,
        wordListId,

        phonemes: {
          create: cleanedPhonemes.map((symbol, index) => ({
            symbol,
            position: index,
          })),
        },
      },

      include: {
        wordList: true,
        phonemes: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return NextResponse.json(word, { status: 201 });
  } catch (error) {
    console.error("POST /api/words error:", error);

    return NextResponse.json(
      {
        error: "Failed to create word.",
      },
      { status: 500 }
    );
  }
}