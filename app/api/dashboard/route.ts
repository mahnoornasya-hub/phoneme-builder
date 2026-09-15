import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Activity configuration counts
    const totalActivities = await prisma.activity.count();

    const wordleActivities = await prisma.activity.count({
      where: {
        type: "WORDLE",
      },
    });

    const wordSearchActivities = await prisma.activity.count({
      where: {
        type: "WORD_SEARCH",
      },
    });

    // Stored content counts
    const totalWordLists = await prisma.wordList.count();
    const totalWords = await prisma.word.count();
    const totalPhonemes = await prisma.phoneme.count();

    // Generation statistics
    const successfulGenerations = await prisma.usageEvent.count({
      where: {
        eventType: "GENERATION_SUCCESS",
      },
    });

    const failedGenerations = await prisma.usageEvent.count({
      where: {
        eventType: "GENERATION_FAILED",
      },
    });

    const totalGenerationAttempts =
      successfulGenerations + failedGenerations;

    const successRate =
      totalGenerationAttempts > 0
        ? Number(
            (
              (successfulGenerations / totalGenerationAttempts) *
              100
            ).toFixed(1)
          )
        : 0;

    // Average time on page
    const durationResult = await prisma.usageEvent.aggregate({
      where: {
        eventType: "PAGE_VIEW",
        durationSeconds: {
          not: null,
        },
      },
      _avg: {
        durationSeconds: true,
      },
    });

    const averageTimeOnPage =
      durationResult._avg.durationSeconds !== null
        ? Number(durationResult._avg.durationSeconds.toFixed(1))
        : 0;

    // Wordle usage
    const wordleUsage = await prisma.usageEvent.count({
      where: {
        activityType: "WORDLE",
        eventType: {
          in: ["GENERATION_SUCCESS", "GENERATION_FAILED"],
        },
      },
    });

    // Word Search usage
    const wordSearchUsage = await prisma.usageEvent.count({
      where: {
        activityType: "WORD_SEARCH",
        eventType: {
          in: ["GENERATION_SUCCESS", "GENERATION_FAILED"],
        },
      },
    });

    let mostUsedActivityType = "No data";

    if (wordleUsage > wordSearchUsage) {
      mostUsedActivityType = "Wordle";
    } else if (wordSearchUsage > wordleUsage) {
      mostUsedActivityType = "Word Search";
    } else if (wordleUsage > 0 && wordSearchUsage > 0) {
      mostUsedActivityType = "Equal";
    }

    // Difficulty distribution
    const easyActivities = await prisma.activity.count({
      where: {
        difficulty: "EASY",
      },
    });

    const mediumActivities = await prisma.activity.count({
      where: {
        difficulty: "MEDIUM",
      },
    });

    const hardActivities = await prisma.activity.count({
      where: {
        difficulty: "HARD",
      },
    });

    // Recent operational events
    const recentEvents = await prisma.usageEvent.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    // Useful word-list statistic
    const averageWordsPerList =
      totalWordLists > 0
        ? Number((totalWords / totalWordLists).toFixed(1))
        : 0;

    return NextResponse.json({
      health: "Operational",

      activities: {
        total: totalActivities,
        wordle: wordleActivities,
        wordSearch: wordSearchActivities,
        mostUsedType: mostUsedActivityType,
      },

      generation: {
        successful: successfulGenerations,
        failed: failedGenerations,
        totalAttempts: totalGenerationAttempts,
        successRate,
      },

      usage: {
        averageTimeOnPage,
        wordleUsage,
        wordSearchUsage,
      },

      content: {
        wordLists: totalWordLists,
        words: totalWords,
        phonemes: totalPhonemes,
        averageWordsPerList,
      },

      difficulty: {
        easy: easyActivities,
        medium: mediumActivities,
        hard: hardActivities,
      },

      recentEvents,
    });
  } catch (error) {
    console.error("Failed to retrieve dashboard statistics:", error);

    return NextResponse.json(
      {
        health: "Error",
        error: "Unable to retrieve dashboard statistics.",
      },
      {
        status: 500,
      }
    );
  }
}