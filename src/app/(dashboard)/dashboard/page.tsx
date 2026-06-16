"use client";

import { useEffect, useState } from "react";


export default function Dashboard() {


    const [data, setData] = useState<any>({});


    useEffect(() => {

        fetch("/api/dashboard")
            .then(res => res.json())
            .then(setData)

    }, [])



    return (

        <div className="p-10">


            <h1 className="text-5xl font-bold">
                Life OS 🚀
            </h1>


            <div className="grid grid-cols-3 gap-6 mt-10">



                <div className="border rounded-xl p-6">

                    <h2 className="text-xl">
                        Goals 🎯
                    </h2>

                    <p className="text-4xl font-bold">
                        {data.goals}
                    </p>

                </div>



                <div className="border rounded-xl p-6">

                    <h2 className="text-xl">
                        Completed ✅
                    </h2>

                    <p className="text-4xl font-bold">
                        {data.completed}
                    </p>

                </div>



                <div className="border rounded-xl p-6">

                    <h2 className="text-xl">
                        Notes 🧠
                    </h2>

                    <p className="text-4xl font-bold">
                        {data.notes}
                    </p>

                </div>



            </div>


        </div>

    )

}