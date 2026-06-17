import { prisma } from "./prisma";

export async function syncHabitsForUser(userId: string) {
  const habits = await prisma.habit.findMany({
    where: { userId },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  for (const habit of habits) {
    let completedToday = habit.completedToday;
    let streak = habit.streak;
    let needsUpdate = false;

    // 1. Reset completedToday if lastCompleted is before today
    if (completedToday) {
      if (!habit.lastCompleted || new Date(habit.lastCompleted).getTime() < today.getTime()) {
        completedToday = false;
        needsUpdate = true;
      }
    } else {
      // If completedToday is false, but lastCompleted is today (e.g. timezone/sync edge case)
      if (habit.lastCompleted && new Date(habit.lastCompleted).getTime() >= today.getTime()) {
        completedToday = true;
        needsUpdate = true;
      }
    }

    // 2. Reset streak to 0 if lastCompleted was before yesterday (missed a day)
    if (habit.lastCompleted) {
      const lastCompletedTime = new Date(habit.lastCompleted).getTime();
      if (lastCompletedTime < yesterday.getTime() && lastCompletedTime < today.getTime()) {
        if (streak > 0) {
          streak = 0;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      await prisma.habit.update({
        where: { id: habit.id },
        data: {
          completedToday,
          streak,
        },
      });
    }
  }
}
