import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


export async function POST(req: Request) {


  const session = await auth();


  if (!session?.user?.id) {

    return NextResponse.json(
      {
        message: "Unauthorized"
      },
      {
        status: 401
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


  const pendingGoals = goals.filter(
    g => !g.completed
  );



  const plan = `

Good morning ${session.user.name} 👋


Today's Life OS Plan 🚀


🎯 Goals:

${pendingGoals.length > 0
      ? pendingGoals.map(g => "- " + g.title).join("\n")
      : "- No pending goals. Add new goals!"
    }



🔥 Habits:

${habits.length > 0
      ? habits.map(h => "- " + h.name + " (🔥 " + h.streak + " days)").join("\n")
      : "- Create your first habit!"
    }



Focus:

Complete one important task first.

Stay consistent 💪

`;


  return NextResponse.json({

    plan

  });


}