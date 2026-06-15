import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notes);
  } catch (error: any) {
    console.error("GET NOTES ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body.title) {
      return NextResponse.json(
        { message: "Note title is required" },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        title: body.title,
        content: body.content || "",
        userId: session.user.id,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    console.error("POST NOTES ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, title, content } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "Note ID is required" },
        { status: 400 }
      );
    }

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note || note.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Note not found" },
        { status: 404 }
      );
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: {
        title: title !== undefined ? title : note.title,
        content: content !== undefined ? content : note.content,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error: any) {
    console.error("PUT NOTES ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Note ID is required" },
        { status: 400 }
      );
    }

    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note || note.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Note not found" },
        { status: 404 }
      );
    }

    await prisma.note.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    console.error("DELETE NOTES ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
