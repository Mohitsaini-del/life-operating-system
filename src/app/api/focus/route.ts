import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { minutes } = await req.json();

    if (!minutes || typeof minutes !== "number" || minutes <= 0) {
      return NextResponse.json(
        { message: "Invalid minutes value" },
        { status: 400 }
      );
    }

    const focus = await prisma.focusSession.create({
      data: {
        userId: session.user.id,
        minutes
      }
    });

    return NextResponse.json(focus);
  } catch (error) {
    console.error("Failed to save focus session:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
