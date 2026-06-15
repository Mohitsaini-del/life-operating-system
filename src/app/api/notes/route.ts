import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";


// GET NOTES
export async function GET() {

  const session = await auth();


  if (!session?.user?.id) {

    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );

  }


  const notes = await prisma.note.findMany({

    where: {
      userId: session.user.id
    },

    orderBy: {
      createdAt: "desc"
    }

  });


  return NextResponse.json(notes);

}



// CREATE NOTE
export async function POST(req: Request) {


  const session = await auth();


  if (!session?.user?.id) {

    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );

  }


  const body = await req.json();



  const note = await prisma.note.create({

    data: {

      title: body.title,

      content: body.content,

      userId: session.user.id

    }

  });


  return NextResponse.json(note);

}




// DELETE NOTE

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



  await prisma.note.delete({

    where: {
      id: id!
    }

  });


  return NextResponse.json({
    message: "Deleted"
  });

}




// UPDATE NOTE
export async function PUT(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  // Make sure the note belongs to the user
  const existingNote = await prisma.note.findUnique({
    where: {
      id: body.id,
    },
  });

  if (!existingNote || existingNote.userId !== session.user.id) {
    return NextResponse.json(
      { message: "Not Found or Unauthorized" },
      { status: 404 }
    );
  }

  const updatedNote = await prisma.note.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return NextResponse.json(updatedNote);
}