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

    // Overall generation statistics
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

    // Overall average time on page
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

    // Wordle average time on page
    const wordleDurationResult = await prisma.usageEvent.aggregate({
      where: {
        eventType: "PAGE_VIEW",
        activityType: "WORDLE",
        durationSeconds: {
          not: null,
        },
      },
      _avg: {
        durationSeconds: true,
      },
    });

    const wordleAverageTime =
      wordleDurationResult._avg.durationSeconds !== null
        ? Number(
            wordleDurationResult._avg.durationSeconds.toFixed(1)
          )
        : 0;

    // Word Search average time on page
    const wordSearchDurationResult =
      await prisma.usageEvent.aggregate({
        where: {
          eventType: "PAGE_VIEW",
          activityType: "WORD_SEARCH",
          durationSeconds: {
            not: null,
          },
        },
        _avg: {
          durationSeconds: true,
        },
      });

    const wordSearchAverageTime =
      wordSearchDurationResult._avg.durationSeconds !== null
        ? Number(
            wordSearchDurationResult._avg.durationSeconds.toFixed(1)
          )
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

    // Most-used activity type
    let mostUsedActivityType = "No data";

    if (wordleUsage > wordSearchUsage) {
      mostUsedActivityType = "Wordle";
    } else if (wordSearchUsage > wordleUsage) {
      mostUsedActivityType = "Word Search";
    } else if (wordleUsage > 0 && wordSearchUsage > 0) {
      mostUsedActivityType = "Equal";
    }

    // Wordle generation performance
    const wordleSuccessful = await prisma.usageEvent.count({
      where: {
        activityType: "WORDLE",
        eventType: "GENERATION_SUCCESS",
      },
    });

    const wordleFailed = await prisma.usageEvent.count({
      where: {
        activityType: "WORDLE",
        eventType: "GENERATION_FAILED",
      },
    });

    const wordleTotal = wordleSuccessful + wordleFailed;

    const wordleSuccessRate =
      wordleTotal > 0
        ? Number(
            ((wordleSuccessful / wordleTotal) * 100).toFixed(1)
          )
        : 0;

    // Word Search generation performance
    const wordSearchSuccessful = await prisma.usageEvent.count({
      where: {
        activityType: "WORD_SEARCH",
        eventType: "GENERATION_SUCCESS",
      },
    });

    const wordSearchFailed = await prisma.usageEvent.count({
      where: {
        activityType: "WORD_SEARCH",
        eventType: "GENERATION_FAILED",
      },
    });

    const wordSearchTotal =
      wordSearchSuccessful + wordSearchFailed;

    const wordSearchSuccessRate =
      wordSearchTotal > 0
        ? Number(
            (
              (wordSearchSuccessful / wordSearchTotal) *
              100
            ).toFixed(1)
          )
        : 0;

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

    // Recent saved activities
    const recentActivities = await prisma.activity.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        name: true,
        type: true,
        difficulty: true,
        createdAt: true,
        updatedAt: true,

        wordList: {
          select: {
            id: true,
            name: true,
          },
        },

        _count: {
          select: {
            words: true,
          },
        },
      },
    });

    // Useful word-list statistic
    const averageWordsPerList =
      totalWordLists > 0
        ? Number((totalWords / totalWordLists).toFixed(1))
        : 0;

    // Generation activity over time
    const generationEvents = await prisma.usageEvent.findMany({
      where: {
        eventType: {
          in: ["GENERATION_SUCCESS", "GENERATION_FAILED"],
        },
      },
      select: {
        eventType: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const generationActivityMap = new Map<
      string,
      {
        date: string;
        successful: number;
        failed: number;
        total: number;
      }
    >();

    for (const event of generationEvents) {
      const date = event.createdAt.toISOString().split("T")[0];

      if (!generationActivityMap.has(date)) {
        generationActivityMap.set(date, {
          date,
          successful: 0,
          failed: 0,
          total: 0,
        });
      }

      const day = generationActivityMap.get(date);

      if (!day) {
        continue;
      }

      if (event.eventType === "GENERATION_SUCCESS") {
        day.successful += 1;
      }

      if (event.eventType === "GENERATION_FAILED") {
        day.failed += 1;
      }

      day.total += 1;
    }

    const generationActivity = Array.from(
      generationActivityMap.values()
    );

    // Operational alerts
    const alerts: {
      level: "success" | "warning" | "info";
      title: string;
      message: string;
    }[] = [];

    // Generation performance alert
    if (totalGenerationAttempts === 0) {
      alerts.push({
        level: "info",
        title: "No Generation Data",
        message:
          "No activity generation attempts have been recorded yet.",
      });
    } else if (successRate < 70) {
      alerts.push({
        level: "warning",
        title: "Generation Performance",
        message: `Generation success rate is currently ${successRate}%.`,
      });
    } else {
      alerts.push({
        level: "success",
        title: "Generation Performance",
        message: `Generation success rate is currently ${successRate}%.`,
      });
    }

    // Word-list availability alert
    if (totalWordLists === 0) {
      alerts.push({
        level: "warning",
        title: "Word Lists",
        message: "No stored word lists are currently available.",
      });
    } else {
      alerts.push({
        level: "success",
        title: "Word Lists",
        message: `${totalWordLists} stored word lists are available.`,
      });
    }

    // Saved activity alert
    if (totalActivities === 0) {
      alerts.push({
        level: "info",
        title: "Activity Data",
        message:
          "No saved activity configurations are currently available.",
      });
    } else {
      alerts.push({
        level: "success",
        title: "Activity Data",
        message: `${totalActivities} saved activity configurations are available.`,
      });
    }

    // Return dashboard reporting data
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

      activityPerformance: {
        wordle: {
          successful: wordleSuccessful,
          failed: wordleFailed,
          totalAttempts: wordleTotal,
          successRate: wordleSuccessRate,
        },

        wordSearch: {
          successful: wordSearchSuccessful,
          failed: wordSearchFailed,
          totalAttempts: wordSearchTotal,
          successRate: wordSearchSuccessRate,
        },
      },

      usage: {
        averageTimeOnPage,
        wordleAverageTime,
        wordSearchAverageTime,
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

      generationActivity,

      alerts,

      recentActivities,

      recentEvents,
    });
  } catch (error) {
    console.error(
      "Failed to retrieve dashboard statistics:",
      error
    );

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