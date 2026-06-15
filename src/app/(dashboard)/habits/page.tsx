"use client";

import { useEffect, useState } from "react";


export default function Habits() {


  const [name, setName] = useState("");

  const [habits, setHabits] = useState<any[]>([]);



  async function loadHabits() {

    const res = await fetch("/api/habits");

    const data = await res.json();

    if (Array.isArray(data)) {
      setHabits(data);
    }

  }



  async function addHabit() {

    if (!name) return;


    await fetch("/api/habits", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        name
      })

    });


    setName("");

    loadHabits();

  }




  async function completeHabit(id: string) {


    await fetch("/api/habits", {

      method: "PATCH",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        id
      })

    });


    loadHabits();

  }




  async function deleteHabit(id: string) {


    await fetch(`/api/habits?id=${id}`, {

      method: "DELETE"

    });


    loadHabits();

  }



  useEffect(() => {

    loadHabits();

  }, []);



  return (

    <div>


      <h1 className="text-4xl font-bold">
        Habits 🔥
      </h1>



      <div className="flex gap-3 mt-8">


        <input

          className="border p-3 rounded-lg"

          placeholder="New habit"

          value={name}

          onChange={(e) => setName(e.target.value)}

        />


        <button

          onClick={addHabit}

          className="bg-black text-white px-5 rounded-lg"

        >
          Add
        </button>


      </div>




      <div className="grid gap-5 mt-10">


        {

          habits.map(habit => (


            <div

              key={habit.id}

              className="border rounded-xl p-6"

            >


              <div className="flex justify-between">


                <h2 className="text-xl font-bold">

                  {habit.name}

                </h2>


                <button

                  onClick={() => deleteHabit(habit.id)}

                  className="text-red-500"

                >
                  Delete
                </button>


              </div>



              <div className="mt-4 text-2xl">

                🔥 {habit.streak} day streak

              </div>



              <button

                disabled={habit.completedToday}

                onClick={() => completeHabit(habit.id)}

                className="mt-4 bg-black text-white px-4 py-2 rounded-lg"

              >

                {
                  habit.completedToday
                    ?
                    "Completed Today ✓"
                    :
                    "Mark Complete"
                }

              </button>



            </div>


          ))

        }


      </div>


    </div>

  )

}