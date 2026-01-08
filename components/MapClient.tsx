"use client";

import { useEffect } from "react";

export default function MapClient() {
  useEffect(() => {
    console.log("Map loaded on client");
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px"
      }}
    >
      Map will render here
    </div>
  );
}
