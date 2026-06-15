import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";


export async function POST(req: Request) {

  try {

    const body = await req.json();

    console.log("Received:", body);


    const { name, email, password } = body;


    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "All fields required"
        },
        {
          status: 400
        }
      );
    }


    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });


    if (existingUser) {
      return NextResponse.json(
        {
          message: "User already exists"
        },
        {
          status: 400
        }
      );
    }


    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });


    return NextResponse.json(
      {
        message: "Account created"
      },
      {
        status: 201
      }
    );


  } catch (error) {

    console.log("ERROR:", error);

    return NextResponse.json(
      {
        message: "Server error"
      },
      {
        status: 500
      }
    );

  }

}