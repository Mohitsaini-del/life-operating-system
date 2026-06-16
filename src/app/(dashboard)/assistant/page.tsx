"use client";

import { useState } from "react";


export default function Assistant() {


  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);



  async function generatePlan() {


    setLoading(true);


    const res = await fetch("/api/assistant", {
      method: "POST"
    });


    const data = await res.json();


    setPlan(data.plan);

    setLoading(false);

  }



  return (

    <div className="p-10">


      <div className="max-w-4xl">


        <h1 className="text-6xl font-bold">
          AI Life Assistant 🤖
        </h1>


        <p className="text-gray-400 mt-4 text-xl">
          Your personal productivity coach
        </p>



        <button

          onClick={generatePlan}

          className="
mt-10
px-8
py-4
rounded-xl
bg-white
text-black
font-semibold
hover:scale-105
transition
"

        >

          {
            loading
              ?
              "Thinking..."
              :
              "Generate My Day"
          }

        </button>



        {
          plan &&

          <div className="
mt-10
bg-zinc-900
border
border-zinc-700
rounded-2xl
p-8
text-lg
whitespace-pre-wrap
">


            {plan}


          </div>

        }



      </div>


    </div>

  )

}