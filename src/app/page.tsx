export default function Home() {

  return (

    <div className="min-h-screen bg-black text-white">


      <div className="max-w-6xl mx-auto px-10 py-20">


        <h1 className="text-7xl font-bold">
          Build Your Life OS 🚀
        </h1>


        <p className="mt-6 text-xl text-zinc-400 max-w-2xl">

          A personal productivity system to manage goals,
          habits, notes and get AI-powered daily planning.

        </p>



        <div className="mt-10 flex gap-5">


          <a

            href="/login"

            className="
bg-white
text-black
px-8
py-4
rounded-xl
font-semibold
"

          >

            Get Started

          </a>



          <a

            href="/dashboard"

            className="
border
border-zinc-700
px-8
py-4
rounded-xl
"

          >

            Dashboard

          </a>


        </div>



        <div className="grid grid-cols-3 gap-6 mt-24">


          <div className="border border-zinc-800 rounded-2xl p-8">

            <h2 className="text-3xl">
              🎯 Goals
            </h2>

            <p className="mt-3 text-zinc-400">
              Track and complete your objectives.
            </p>

          </div>



          <div className="border border-zinc-800 rounded-2xl p-8">

            <h2 className="text-3xl">
              🔥 Habits
            </h2>

            <p className="mt-3 text-zinc-400">
              Build consistency every day.
            </p>

          </div>



          <div className="border border-zinc-800 rounded-2xl p-8">

            <h2 className="text-3xl">
              🤖 AI
            </h2>

            <p className="mt-3 text-zinc-400">
              Generate your daily action plan.
            </p>

          </div>



        </div>


      </div>


    </div>

  )

}