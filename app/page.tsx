"use client";

import dynamic from "next/dynamic";

const MapClient = dynamic(
  () => import("../components/MapClient"),
  { ssr: false }
);

export default function Home() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>NDWI Viewer</h1>
      <p>Click on the map to compute NDWI</p>
      <MapClient />
    </main>
  );
}
