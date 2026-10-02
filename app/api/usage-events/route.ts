import { NextResponse } from "next/server";
import { ActivityType, UsageEventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const validEventTypes = Object.values(UsageEventType);
const validActivityTypes = Object.values(ActivityType);

export async function GET() {
  try {
    const events = await prisma.usageEvent.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to retrieve usage events:", error);

    return NextResponse.json(
      { error: "Unable to retrieve usage events." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      eventType,
      activityType,
      page,
      durationSeconds,
      message,
    } = body;

    if (
      !eventType ||
      !validEventTypes.includes(eventType as UsageEventType)
    ) {
      return NextResponse.json(
        { error: "A valid event type is required." },
        { status: 400 }
      );
    }

    if (
      activityType !== undefined &&
      activityType !== null &&
      activityType !== "" &&
      !validActivityTypes.includes(activityType as ActivityType)
    ) {
      return NextResponse.json(
        { error: "Invalid activity type." },
        { status: 400 }
      );
    }

    if (
      durationSeconds !== undefined &&
      durationSeconds !== null &&
      (!Number.isInteger(durationSeconds) || durationSeconds < 0)
    ) {
      return NextResponse.json(
        { error: "Duration must be a non-negative whole number." },
        { status: 400 }
      );
    }

    const event = await prisma.usageEvent.create({
      data: {
        eventType: eventType as UsageEventType,

        activityType:
          activityType && activityType !== ""
            ? (activityType as ActivityType)
            : null,

        page:
          typeof page === "string" && page.trim()
            ? page.trim()
            : null,

        durationSeconds:
          durationSeconds !== undefined && durationSeconds !== null
            ? durationSeconds
            : null,

        message:
          typeof message === "string" && message.trim()
            ? message.trim()
            : null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Failed to create usage event:", error);

    return NextResponse.json(
      { error: "Unable to create usage event." },
      { status: 500 }
    );
  }
}