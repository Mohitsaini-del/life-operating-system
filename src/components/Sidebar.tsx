"use client";

import Link from "next/link";


export default function Sidebar() {

  return (

    <div className="w-64 min-h-screen border-r p-6">

      <h1 className="text-3xl font-bold mb-10">
        Life OS 🚀
      </h1>


      <nav className="space-y-5">


        <Link href="/dashboard">
          Dashboard
        </Link>

        <br />


        <Link href="/goals">
          Goals 🎯
        </Link>

        <br />


        <Link href="/habits">
          Habits 🔥
        </Link>

        <br />


        <Link href="/notes">
          Notes 🧠
        </Link>

        <br />


        <Link href="/assistant">
          AI Assistant 🤖
        </Link>


      </nav>

    </div>

  )

}