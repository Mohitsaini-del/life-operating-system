import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


export async function GET() {

    const session = await auth();


    if (!session?.user?.id) {

        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        )

    }


    const userId = session.user.id;


    const goals = await prisma.goal.count({
        where: {
            userId
        }
    });


    const completed = await prisma.goal.count({

        where: {
            userId,
            completed: true
        }

    });


    const notes = await prisma.note.count({

        where: {
            userId
        }

    });



    return NextResponse.json({

        goals,
        completed,
        notes

    });


}