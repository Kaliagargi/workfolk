"use client";

import { useEffect, useState } from "react";

export default function MapClient() {
  const [status, setStatus] = useState("Idle");

  const API = process.env.NEXT_PUBLIC_API_URL;

  async function testBackend() {
    try {
      setStatus("Calling backend...");
      const res = await fetch(`${API}/health`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const text = await res.text();
      setStatus("Backend OK ✅");
    } catch (err) {
      console.error(err);
      setStatus("Backend unreachable ❌");
    }
  }

  return (
    <div>
      <button onClick={testBackend}>Test NDWI Backend</button>
      <p>{status}</p>
    </div>
  );
}

