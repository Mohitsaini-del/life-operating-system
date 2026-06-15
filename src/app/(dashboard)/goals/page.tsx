"use client";

import { useEffect, useState } from "react";


export default function Goals() {

  const [title, setTitle] = useState("");

  const [goals, setGoals] = useState<any[]>([]);



  async function loadGoals() {

    const res = await fetch("/api/goals");

    const data = await res.json();

    setGoals(data);

  }



  async function addGoal() {

    if (!title) return;


    await fetch("/api/goals", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        title

      })

    });


    setTitle("");

    loadGoals();

  }




  async function updateGoal(id: string, progress: number, completed: boolean) {


    await fetch("/api/goals", {

      method: "PATCH",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        id,
        progress,
        completed

      })

    });


    loadGoals();

  }




  async function deleteGoal(id: string) {


    await fetch(`/api/goals?id=${id}`, {

      method: "DELETE"

    });


    loadGoals();

  }



  useEffect(() => {

    loadGoals();

  }, []);



  return (

    <div>


      <h1 className="text-4xl font-bold">
        Goals 🎯
      </h1>


      <div className="flex gap-3 mt-8">


        <input

          className="border p-3 rounded-lg"

          placeholder="New goal"

          value={title}

          onChange={(e) => setTitle(e.target.value)}

        />


        <button

          onClick={addGoal}

          className="bg-black text-white px-5 rounded-lg"

        >
          Add
        </button>


      </div>




      <div className="mt-10 grid gap-5">


        {
          goals.map(goal => (


            <div

              key={goal.id}

              className="border rounded-xl p-6"

            >


              <div className="flex justify-between">


                <h2 className="text-xl font-bold">

                  {goal.title}

                </h2>


                <button

                  onClick={() => deleteGoal(goal.id)}

                  className="text-red-500"

                >
                  Delete
                </button>


              </div>



              <div className="mt-5">


                <input

                  type="range"

                  min="0"

                  max="100"

                  value={goal.progress}

                  onChange={(e) => updateGoal(

                    goal.id,

                    Number(e.target.value),

                    goal.completed

                  )}

                />


                <p>

                  Progress: {goal.progress}%

                </p>


              </div>



              <label className="flex gap-2 mt-3">


                <input

                  type="checkbox"

                  checked={goal.completed}

                  onChange={(e) => updateGoal(

                    goal.id,

                    goal.progress,

                    e.target.checked

                  )}

                />


                Completed

              </label>



            </div>


          ))

        }


      </div>


    </div>

  )

}