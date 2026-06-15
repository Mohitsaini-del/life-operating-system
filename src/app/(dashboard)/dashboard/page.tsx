"use client";

import { useEffect, useState } from "react";


export default function Dashboard() {


  const [score, setScore] = useState(0);



  useEffect(() => {

    fetch("/api/productivity")
      .then(res => res.json())
      .then(data => setScore(data.score));


  }, []);



  return (

    <div>


      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>


      <div className="border rounded-xl p-6 mt-10">


        <h2 className="text-xl font-bold">
          Productivity Score
        </h2>


        <div className="text-5xl mt-4">

          {score}%

        </div>



        <div className="w-full bg-gray-200 rounded mt-5">

          <div

            className="bg-black h-3 rounded"

            style={{
              width: `${score}%`
            }}

          />

        </div>


      </div>


    </div>

  )

}