"use client";

import { useEffect, useState } from "react";


export default function MapClient() {
  const [Map, setMap] = useState<any>(null);
  const [point, setPoint] = useState<{ lat: number; lon: number } | null>(null);
  const [ndwi, setNdwi] = useState<number | null>(null);
  const [ndwiTile, setNdwiTile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    async function loadLeaflet() {
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

      const {
        MapContainer,
        TileLayer,
        Marker,
        useMapEvents,
      } = await import("react-leaflet");

      function ClickHandler() {
        useMapEvents({
          click(e: any) {
            const lat = e.latlng.lat;
            const lon = e.latlng.lng;

            setPoint({ lat, lon });
          setLoading(true);
const API = process.env.NEXT_PUBLIC_API_URL;

fetch(`${API}/ndwi?lat=${lat}&lon=${lon}`, {
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
})
  .then((res) => res.json())
  .then((data) => {
    setNdwi(data.mean_ndwi);
    setNdwiTile(data.ndwi_tile_url);
  })
  .catch((err) => console.error("Fetch error:", err))


  .finally(() => setLoading(false));

          },
        });
        return null;
      }

      setMap(() => (
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
        </>
      ));
    }

    loadLeaflet();
  }, [point, ndwiTile]);

  if (!Map) return <p>Loading map…</p>;

  return (
    <>
      {Map}
      {ndwi !== null && (
        <p style={{ marginTop: "12px", fontSize: "18px" }}>
          Mean NDWI: <b>{ndwi.toFixed(3)}</b>
        </p>
      )}
    </>
  );
}
