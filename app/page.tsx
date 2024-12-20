'use client'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentData } from "firebase/firestore";
import { fetchData } from "./actions/fetchData";
import { createData } from "./actions/createData";
import { updateData } from "./actions/updateData";
import { deleteData } from "./actions/deleteData";

export default function Page() {
  const router = useRouter();
  const [docData, setDocData] = useState<DocumentData | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const authCheck = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      }
    });

    clientFetchData()

    return () => authCheck();
  }, [router]);

  function clientFetchData() {
    fetchData().then(r => {
      if (!r) {
        return;
      }
      if (r.status === 401) {
        signOut(auth);
      }
      setDocData(r)
      const initialEditValues = Object.entries(r).reduce<Record<string, string>>((acc, [id, todo]) => {
        acc[id] = todo.name;
        return acc;
      }, {});
      setEditValues(initialEditValues);
    });
  }

  async function clientCreateData() {
    const value = prompt("Please enter your to-do", "Water Plants");
    if (value == null || value == "") {
      alert("cancel")
    } else {
      await createData(value).then(r => alert(r));
      clientFetchData()
    }
  }

  async function clientUpdateData(type: "name" | "done", value: string | boolean, id: string) {
    await updateData(type, value, id).then((r) => alert(r))
    clientFetchData();
  }

  function handleInputChange(id: string, value: string) {
    setEditValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  async function clientDeleteData(id: string) {
    await deleteData(id).then((r) => alert(r))
    clientFetchData();
  }

  return (
    <>
      <h1>To-do</h1>
      {docData ? (
        <ul>
          <button onClick={() => clientCreateData()}>New entry</button>
          {Object.entries(docData).map(([id, todo]) => (
            <li key={id}>
              <input
                value={editValues[id] || ""}
                onChange={(e) => handleInputChange(id, e.target.value)}
                type="text"
                className="text-black border bg-slate-50"
              />
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => clientUpdateData("done", !todo.done, id)}
              />
              <button onClick={() => clientUpdateData("name", editValues[id], id)}>Update name</button>
              <button onClick={() => clientDeleteData(id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}