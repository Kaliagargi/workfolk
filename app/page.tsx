import ClientOnly from "@/components/mapwrapper";
import MapClient from "@/components/MapClient";

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>NDWI Viewer</h1>

      <ClientOnly>
        <MapClient />
      </ClientOnly>
    </main>
  );
}
