import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "phoneme-builder",
    },
    {
      status: 200,
    }
  );
}