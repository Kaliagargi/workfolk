"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import {MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

export default function MapClient() {
  const [leafletReady, setLeafletReady] = useState(false);
  const [point, setPoint] = useState<{ lat: number; lon: number } | null>(null);
  const [ndwi, setNdwi] = useState<number | null>(null);
  const [ndwiTile, setNdwiTile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Load Leaflet icons once
  useEffect(() => {
    async function setupLeaflet() {
      const L = (await import("leaflet")).default;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      setLeafletReady(true);
    }

    setupLeaflet();
  }, []);

  // 🔹 Fetch NDWI from backend
  async function fetchNdwi(lat: number, lon: number) {
    try {
      setLoading(true);

      const API = process.env.NEXT_PUBLIC_API_URL;
      if (!API) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined");
      }

      const res = await fetch(
        `${API}/ndwi?lat=${lat}&lon=${lon}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const data = await res.json();

      setNdwi(data.mean_ndwi);
      setNdwiTile(data.ndwi_tile_url);
    } catch (err) {
      console.error("NDWI fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Handle map click
  function ClickHandler() {
    useMapEvents({
      click(e: any) {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;

        setPoint({ lat, lon });
        fetchNdwi(lat, lon);
      },
    });

    return null;
  }

  if (!leafletReady) return <p>Loading map…</p>;

  return (
    <>
      <MapContainer
        center={[20, 78]}
        zoom={5}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler />
        {point && <Marker position={[point.lat, point.lon]} />}
        {ndwiTile && <TileLayer url={ndwiTile} opacity={0.6} />}
      </MapContainer>

      {loading && <p>Fetching NDWI…</p>}

      {ndwi !== null && (
        <p style={{ marginTop: "12px", fontSize: "18px" }}>
          Mean NDWI: <b>{ndwi.toFixed(3)}</b>
        </p>
      )}
    </>
  );
}
