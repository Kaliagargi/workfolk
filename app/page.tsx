"use client";

import MapClient from "../components/MapClient";

export default function Home() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>NDWI Viewer</h1>
      <p>Click on the map to compute NDWI</p>
      <MapClient />
    </main>
  );
}

