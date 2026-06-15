"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";


export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  async function handleLogin() {

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });


    console.log(result);


    if (result?.ok) {
      router.push("/dashboard");
    }
    else {
      alert("Login failed");
    }

  }

  return (

    <div className="min-h-screen flex items-center justify-center">

      <div className="w-96 space-y-4">


        <h1 className="text-3xl font-bold">
          Login
        </h1>


        <input
          className="border p-3 w-full"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />


        <input
          className="border p-3 w-full"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />


        <button

          onClick={handleLogin}

          className="bg-black text-white p-3 w-full"

        >
          Login
        </button>


      </div>

    </div>

  );

}