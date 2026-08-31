import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const wordLists = await prisma.wordList.findMany({
      include: {
        words: {
          include: {
            phonemes: {
              orderBy: {
                position: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(wordLists, { status: 200 });
  } catch (error) {
    console.error("GET /api/word-lists error:", error);

    return NextResponse.json(
      { error: "Failed to load word lists." },
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

    const wordList = await prisma.wordList.create({
      data: {
        name,
        description: description || null,
      },
      include: {
        words: true,
      },
    });

    return NextResponse.json(wordList, { status: 201 });
  } catch (error) {
    console.error("POST /api/word-lists error:", error);

    return NextResponse.json(
      { error: "Failed to create word list." },
      { status: 500 }
    );
  }
}