import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


// GET habits
export async function GET() {

  const session = await auth();


  if (!session?.user?.id) {

    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );

  }


  const habits = await prisma.habit.findMany({

    where: {
      userId: session.user.id
    },

    orderBy: {
      createdAt: "desc"
    }

  });


  return NextResponse.json(habits);

}



// CREATE habit
export async function POST(req: Request) {

  const session = await auth();


  if (!session?.user?.id) {

    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );

  }


  const body = await req.json();


  const habit = await prisma.habit.create({

    data: {

      name: body.name,

      streak: 0,

      completedToday: false,

      userId: session.user.id

    }

  });


  return NextResponse.json(habit);

}



// COMPLETE HABIT
export async function PATCH(req: Request) {

  const session = await auth();


  if (!session?.user?.id) {

    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );

  }


  const body = await req.json();


  const habit = await prisma.habit.findUnique({

    where: {
      id: body.id
    }

  });



  if (!habit) {

    return NextResponse.json(
      { message: "Not found" },
      { status: 404 }
    );

  }



  const updated = await prisma.habit.update({

    where: {
      id: body.id
    },


    data: {

      completedToday: true,

      streak: habit.streak + 1,

      lastCompleted: new Date()

    }

  });


  return NextResponse.json(updated);

}



// DELETE habit
export async function DELETE(req: Request) {


  const session = await auth();


  if (!session?.user?.id) {

    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );

  }


  const { searchParams } = new URL(req.url);


  const id = searchParams.get("id");



  await prisma.habit.delete({

    where: {
      id: id!
    }

  });



  return NextResponse.json({
    message: "Deleted"
  });

}