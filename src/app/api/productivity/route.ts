import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


export async function GET() {

  const session = await auth();


  if (!session?.user?.id) {

    return NextResponse.json(
      {
        score: 0
      }
    );

  }



  const goals = await prisma.goal.findMany({

    where: {
      userId: session.user.id
    }

  });


  const habits = await prisma.habit.findMany({

    where: {
      userId: session.user.id
    }

  });



  const completedGoals = goals.filter(
    g => g.completed
  ).length;



  const completedHabits = habits.filter(
    h => h.completedToday
  ).length;



  let score = 0;


  if (goals.length) {

    score += (completedGoals / goals.length) * 50;

  }


  if (habits.length) {

    score += (completedHabits / habits.length) * 50;

  }



  return NextResponse.json({

    score: Math.round(score)

  });

}