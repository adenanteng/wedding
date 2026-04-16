import Image from "next/image"
import { Map, MapControls, MapMarker, MapRoute, MarkerContent, MarkerLabel, useMap } from "../ui/map";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Clock, Loader2, MapPin, MapPinIcon, Navigation, RouteIcon } from "lucide-react";
import { useEffect, useState } from "react";

const VENUE_COORDS = { lng: 105.29310599848067, lat: -5.1484356219499166, name: "Metro Nih Boss" };

interface RouteData {
  coordinates: [number, number][];
  duration: number;
  distance: number;
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function RouteBoundsUpdater({ start, end }: { start: { lng: number, lat: number } | null, end: { lng: number, lat: number } }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !start) return;

    const bounds: [number, number, number, number] = [
      Math.min(start.lng, end.lng),
      Math.min(start.lat, end.lat),
      Math.max(start.lng, end.lng),
      Math.max(start.lat, end.lat)
    ];

    map.fitBounds(bounds, {
      padding: 40,
      duration: 1000
    });
  }, [map, isLoaded, start, end]);

  return null;
}

function WeddingMap({ height = "280px" }: { height?: string }) {
  return (
    <div
      className="w-full relative rounded-3xl overflow-hidden border-2 border-primary mt-4 outline-none transition-all duration-500"
      style={{ height }}
    >
      <Map
        center={[VENUE_COORDS.lng, VENUE_COORDS.lat]}
        zoom={15}
        interactive={true}
        theme="light"
      >
        <MapControls
          showZoom={true}
          showLocate={true}
          position="bottom-right"
        />

        <MapMarker longitude={VENUE_COORDS.lng} latitude={VENUE_COORDS.lat}>
          <MarkerContent>
            <div className="size-6 rounded-full bg-primary border-2 border-white shadow-lg flex items-center justify-center">
              <div className="size-2 rounded-full bg-white animate-pulse" />
            </div>
            <MarkerLabel position="top">{VENUE_COORDS.name}</MarkerLabel>
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  );
}

function EventRouteMap({ destination }: { destination: { lng: number, lat: number, name: string } }) {
  const [userLoc, setUserLoc] = useState<{ lng: number, lat: number } | null>(null);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({ lng: pos.coords.longitude, lat: pos.coords.latitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userLoc) return;

    async function fetchRoutes() {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${userLoc?.lng},${userLoc?.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&alternatives=true`
        );
        const data = await response.json();

        if (data.routes?.length > 0) {
          const routeData: RouteData[] = data.routes.map(
            (route: any) => ({
              coordinates: route.geometry.coordinates,
              duration: route.duration,
              distance: route.distance,
            })
          );
          setRoutes(routeData);
        }
      } catch (error) {
        console.error("Failed to fetch routes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoutes();
  }, [userLoc, destination]);

  const center: [number, number] = userLoc
    ? [(userLoc.lng + destination.lng) / 2, (userLoc.lat + destination.lat) / 2]
    : [destination.lng, destination.lat];

  return (
    <div className="w-full h-full relative">
      <Map center={center} zoom={userLoc ? 12 : 15} theme="light">
        <RouteBoundsUpdater start={userLoc} end={destination} />

        <MapControls
          showZoom={true}
          showLocate={true}
          showCompass={true}
          position="bottom-right"
        />

        {routes.map((route, index) => (
          <MapRoute
            key={index}
            coordinates={route.coordinates}
            color={index === 0 ? "#6366f1" : "#94a3b8"}
            width={index === 0 ? 5 : 4}
            opacity={index === 0 ? 1 : 0.6}
          />
        ))}

        {userLoc && (
          <MapMarker longitude={userLoc.lng} latitude={userLoc.lat}>
            <MarkerContent>
              <div className="size-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
              <MarkerLabel position="top">Anda</MarkerLabel>
            </MarkerContent>
          </MapMarker>
        )}

        <MapMarker longitude={destination.lng} latitude={destination.lat}>
          <MarkerContent>
            <div className="size-5 rounded-full bg-primary border-2 border-white shadow-lg" />
            <MarkerLabel position="bottom">{destination.name}</MarkerLabel>
          </MarkerContent>
        </MapMarker>
      </Map>

      {routes.length > 0 && (
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-900">
              <Clock className="size-3 text-primary" />
              {formatDuration(routes[0].duration)}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <RouteIcon className="size-3" />
              {formatDistance(routes[0].distance)}
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}

export default function EventSection() {
  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${VENUE_COORDS.lat},${VENUE_COORDS.lng}`;

  const locations = [
    {
      venue: 'Akad Nikah',
      address: 'Jl. Taman Wijaya Kusuma, Ps. Baru, Kecamatan Sawah Besar, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta',
      mapUrl: 'https://maps.app.goo.gl/4vd44MRbjpuFvgrWA',
      lng: 105.29310599848067,
      lat: -5.1484356219499166,
    },
    // {
    //     title: 'Resepsi',
    //     time: '11:00 - 14:00 WIB',
    //     date: 'Minggu, 14 Juni 2026',
    //     venue: 'Hotel Indonesia Kempinski',
    //     address: 'Jl. M.H. Thamrin No.1, RT.1/RW.5, Menteng, Kec. Menteng, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta',
    //     mapUrl: 'https://maps.app.goo.gl/ZqBxYpK2qK5JQR297',
    //     embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.491264421111!2d106.82020297587127!3d-6.19873099378877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f41f3e9b11bd%3A0xd6e5f8b9e6f30a2f!2sHotel%20Indonesia%20Kempinski%20Jakarta!5e0!3m2!1sid!2sid!4v1709477209787!5m2!1sid!2sid'
    // }
  ];

  return (
    <div className="flex w-full flex-col items-center px-6 pt-10 pb-16">
      {/* Disco Ball + Save The Date */}
      <div className="flex w-full max-w-xs items-start justify-between gap-2">
        {/* Disco Ball */}
        <div className="w-[120px] shrink-0">
          <Image
            src="/img/disco.png"
            alt="Disco ball illustration"
            width={240}
            height={240}
            className="h-auto w-full object-contain -rotate-5"
          />
        </div>
        {/* Save The Date text */}
        <h2
          className="text-center text-5xl tracking-wide text-primary font-bold uppercase rotate-10"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Save
          <br />
          The
          <br />
          Date!
        </h2>
      </div>

      {/* Calendar Section */}
      <div className="mt-8 flex w-[calc(100%+5rem)] -mx-10 items-stretch -rotate-5">
        {/* Saturday */}
        <div className="flex flex-1 flex-col items-center border-y-2 border-l-2 border-primary">
          <span
            className="text-sm font-bold text-primary border-b-2 border-primary w-full text-center pb-1 mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Minggu
          </span>
          <span
            className="mt-1 text-5xl text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            14
          </span>
        </div>

        {/* Sunday (D-day) */}
        <div className="relative flex flex-1 flex-col items-center border-2 border-r-2 border-primary pb-5">
          <span
            className="text-sm font-bold text-primary border-b-2 border-primary w-full text-center pb-1 mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Senin
          </span>
          <span
            className="mt-1 text-5xl text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            15
          </span>
          {/* Circle around D-day */}
          <div className="absolute top-10 right-10">
            <Image
              src="/img/circle.svg"
              alt="Circle"
              width={60}
              height={60}
              className="h-[60px] w-[60px] object-contain"
            />
          </div>
          <span
            className="absolute top-22 right-5 text-sm font-bold text-primary -rotate-10"
            style={{ fontFamily: "var(--font-handwritten)" }}
          >
            D-day !!
          </span>
        </div>

        {/* Monday */}
        <div className="flex flex-1 flex-col items-center border-y-2 border-r-2 border-primary">
          <span
            className="text-sm font-bold text-primary border-b-2 border-primary w-full text-center pb-1 mb-5"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Selasa
          </span>
          <span
            className="mt-1 text-5xl text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            16
          </span>
        </div>
      </div>

      {/* Wedding Party Heading */}
      <h3
        className="mt-10 text-center text-3xl tracking-wide text-primary"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Wedding Party
      </h3>

      {/* Event Details */}
      <div
        className="mt-5 text-center text-sm leading-relaxed"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        <p>Sunday, 15 Juni 2026</p>
        <p>09.00 WIB</p>
        <p className="mt-2">di Mana mana</p>
        <p>Jl. Kemang Timur No.89, Bangka, Kec.</p>
        <p>Mampang Prpt., Kota Metro</p>
      </div>

      <div className="w-full px-10">
        <WeddingMap />
      </div>

      {/* See Location Drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <button
            className="mt-8 rounded-lg border-2 border-primary bg-primary text-white px-6 py-3 text-sm tracking-wider transition-all hover:bg-white hover:text-primary flex items-center gap-2 group"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Navigation className="size-4 group-hover:animate-bounce" />
            Lihat Rute
          </button>
        </DrawerTrigger>
        <DrawerContent className="bg-transparent border-none before:border-2 before:border-primary">
          <div className="mx-auto w-full max-w-sm px-6 pb-8">
            <DrawerHeader className="px-0">
              <DrawerTitle className="text-2xl text-primary flex justify-center items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <MapPin className="size-6" />
                Rute Lokasi
              </DrawerTitle>
              {/* <DrawerDescription className="text-sm text-center" style={{ fontFamily: "var(--font-heading)" }}>
                Silakan klik tombol di bawah untuk membuka navigasi di Google Maps.
              </DrawerDescription> */}
            </DrawerHeader>

            <div className="mb-4">
              {locations.map((loc, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <div className="w-full h-[40vh] rounded-3xl overflow-hidden relative border-2 border-primary" data-vaul-no-drag>
                    <EventRouteMap
                      destination={{
                        lng: (loc as any).lng,
                        lat: (loc as any).lat,
                        name: loc.venue
                      }}
                    />
                  </div>

                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-primary text-white rounded-xl text-center font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <Navigation className="size-5" />
                Buka di Google Maps
              </a>
              <DrawerClose asChild>
                <button
                  className="w-full py-3 text-primary font-bold border-2 border-primary rounded-xl transition-all hover:bg-primary/5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Tutup
                </button>
              </DrawerClose>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
