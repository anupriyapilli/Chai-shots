"use client";

import { useEffect, useState } from "react";

type Program = {
  id: string;
  title: string;
  languagePrimary: string;
  status: string;          // e.g. "DRAFT" | "PUBLISHED"
};

export default function ProgramsPage() {
  const [token, setToken] = useState("");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [status, setStatus] =
    useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("accessToken");
    if (stored) setToken(stored);
  }, []);

  async function loadPrograms() {
    if (!token) {
      setStatus("error");
      setErrorMessage("Please log in again to get a fresh token.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("http://localhost:4000/programs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch programs");

      const data = await res.json();
      setPrograms(data);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>Programs</h1>

      <button onClick={loadPrograms}>Load Programs</button>

      {status === "error" && <p style={{ color: "red" }}>{errorMessage}</p>}

      {programs.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Primary Language</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.languagePrimary}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
