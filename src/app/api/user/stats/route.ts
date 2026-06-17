import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ level: 1, xp: 0 }, { status: 401 });
  }

  const userId = session.user.id;

  const completedGoalsCount = await prisma.goal.count({
    where: { userId, completed: true }
  });

  const totalCompletedHabits = await prisma.habitLog.count({
    where: {
      completed: true,
      habit: {
        userId
      }
    }
  });

  const totalFocusSessions = await prisma.focusSession.aggregate({
    where: { userId },
    _sum: {
      minutes: true
    }
  });
  const totalFocusMinutes = totalFocusSessions._sum.minutes || 0;

  const totalXP = (totalCompletedHabits * 50) + (completedGoalsCount * 150) + totalFocusMinutes;
  const characterLevel = Math.floor(totalXP / 1000) + 1;

  return NextResponse.json({
    level: characterLevel,
    xp: totalXP
  });
}
