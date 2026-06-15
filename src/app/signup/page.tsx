"use client";

import { useState } from "react";

export default function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup() {

    console.log("CLICKED SIGNUP");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });


    const data = await res.json();

    console.log(data);

    alert(data.message);

  }


  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-96 space-y-4">

        <h1 className="text-3xl font-bold">
          Create Account
        </h1>


        <input
          className="border p-2 w-full"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />


        <input
          className="border p-2 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />


        <input
          className="border p-2 w-full"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />


        <button
          onClick={handleSignup}
          className="bg-black text-white p-2 w-full"
        >
          Signup
        </button>


      </div>

    </div>
  );
}