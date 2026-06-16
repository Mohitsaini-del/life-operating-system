"use client";

import { useEffect, useState } from "react";


export default function Notes() {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [notes, setNotes] = useState<any[]>([]);



    async function loadNotes() {

        const res = await fetch("/api/notes");

        const data = await res.json();

        if (Array.isArray(data)) {
            setNotes(data);
        }

    }



    async function addNote() {

        if (!title || !content) return;


        await fetch("/api/notes", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title,
                content
            })

        });


        setTitle("");
        setContent("");

        loadNotes();

    }




    async function deleteNote(id: string) {


        await fetch(`/api/notes?id=${id}`, {

            method: "DELETE"

        });


        loadNotes();

    }



    useEffect(() => {

        loadNotes();

    }, []);



    return (

        <div>


            <h1 className="text-4xl font-bold">
                Second Brain 🧠
            </h1>



            <div className="mt-8 space-y-3">


                <input

                    className="border p-3 w-full"

                    placeholder="Title"

                    value={title}

                    onChange={(e) => setTitle(e.target.value)}

                />



                <textarea

                    className="border p-3 w-full"

                    placeholder="Write note..."

                    value={content}

                    onChange={(e) => setContent(e.target.value)}

                />



                <button

                    onClick={addNote}

                    className="bg-black text-white px-5 py-3 rounded"

                >
                    Save Note
                </button>


            </div>



            <div className="grid gap-5 mt-10">


                {
                    notes.map(note => (


                        <div

                            key={note.id}

                            className="border rounded-xl p-5"

                        >


                            <div className="flex justify-between">


                                <h2 className="font-bold text-xl">

                                    {note.title}

                                </h2>


                                <button

                                    onClick={() => deleteNote(note.id)}

                                    className="text-red-500"

                                >
                                    Delete
                                </button>


                            </div>



                            <p className="mt-3">

                                {note.content}

                            </p>


                        </div>


                    ))

                }


            </div>


        </div>

    )

}