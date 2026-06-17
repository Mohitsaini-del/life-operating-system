import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { syncHabitsForUser } from "@/lib/habits";


export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  await syncHabitsForUser(userId);

  const goalsCount = await prisma.goal.count({
    where: { userId }
  });

  const completedGoalsCount = await prisma.goal.count({
    where: { userId, completed: true }
  });

  const notesCount = await prisma.note.count({
    where: { userId }
  });

  const habitsCount = await prisma.habit.count({
    where: { userId }
  });

  const completedHabitsCount = await prisma.habit.count({
    where: { userId, completedToday: true }
  });

  // Calculate productivity score
  let productivityScore = 0;
  if (goalsCount) {
    productivityScore += (completedGoalsCount / goalsCount) * 50;
  }
  if (habitsCount) {
    productivityScore += (completedHabitsCount / habitsCount) * 50;
  }
  productivityScore = Math.round(productivityScore);

  const recentGoals = await prisma.goal.findMany({
    where: { userId, completed: false },
    orderBy: { updatedAt: "desc" },
    take: 3
  });

  const recentHabits = await prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  // Calculate total lifetime completions for RPG level system
  const totalCompletedHabits = await prisma.habitLog.count({
    where: {
      completed: true,
      habit: {
        userId
      }
    }
  });

  // Focus Hours calculations
  const totalFocusSessions = await prisma.focusSession.aggregate({
    where: { userId },
    _sum: {
      minutes: true
    }
  });
  const totalFocusMinutes = totalFocusSessions._sum.minutes || 0;
  
  const focusHours = Math.floor(totalFocusMinutes / 60);
  const focusRemainingMins = totalFocusMinutes % 60;
  const focusHoursFormatted = `${focusHours}h ${focusRemainingMins}m`;

  // Daily focus minutes for the last 7 days (sparkline graph)
  const todayDate = new Date();
  todayDate.setUTCHours(0, 0, 0, 0);
  const focusSparklineData: number[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayDate);
    d.setDate(todayDate.getDate() - i);
    const nextD = new Date(d.getTime() + 24 * 60 * 60 * 1000);
    
    const sumResult = await prisma.focusSession.aggregate({
      where: {
        userId,
        createdAt: {
          gte: d,
          lt: nextD
        }
      },
      _sum: {
        minutes: true
      }
    });
    // Store in decimal hours (rounded to 1 decimal place) to map cleanly to sparkline rendering
    const dailyMins = sumResult._sum.minutes || 0;
    focusSparklineData.push(Number((dailyMins / 60).toFixed(1)));
  }

  // Calculate total XP (include 1 XP per minute focused)
  const totalXP = (totalCompletedHabits * 50) + (completedGoalsCount * 150) + totalFocusMinutes;
  const characterLevel = Math.floor(totalXP / 1000) + 1;
  const levelProgress = totalXP % 1000;

  return NextResponse.json({
    userName: session.user.name || "User",
    goalsCount,
    completedGoalsCount,
    notesCount,
    habitsCount,
    completedHabitsCount,
    productivityScore,
    recentGoals,
    recentHabits,
    characterLevel,
    levelProgress,
    totalXP,
    totalFocusMinutes,
    focusHoursFormatted,
    focusSparklineData
  });
}