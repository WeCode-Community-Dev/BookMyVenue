import { Map, MapControls } from "@/components/ui/map";
import Navbar from "../components/Navbar";

export default function MapTest() {
  return (
    <div className="min-h-screen text-white bg-[#0a0a0c]">
      <Navbar />
      <div className="pt-32 px-6 max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[#c5a059]">Map Installation Test</h1>
        <p className="text-white/60">Testing @mapcn/map rendering. Centered on Kannur, Kerala, India.</p>
        
        <div className="h-[450px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-black">
          <Map
            className="h-full w-full"
            center={[75.3704, 11.8745]} // [longitude, latitude] for Kannur (Note: mapcn uses [lng, lat] order)
            zoom={13}
          >
            <MapControls showZoom showLocate showFullscreen />
          </Map>
        </div>
      </div>
    </div>
  );
}
