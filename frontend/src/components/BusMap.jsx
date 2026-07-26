import { useEffect, useRef, useState } from "react";

import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const busIcon = L.divIcon({
  className: "custom-bus-marker",
  html: `
    <div style="
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #10b981;
      border: 2px solid #022c22;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
    ">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#022c22" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/>
        <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.9 6.8 19.9 6 18.8 6H3.7c-.6 0-1.2.3-1.6.8L1 8.6"/>
        <path d="M2 12v5c0 .6.4 1 1 1h2"/>
        <circle cx="7" cy="18" r="2"/><circle cx="16" cy="18" r="2"/>
      </svg>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -18],
});

function AnimatedBusMarker({ bus }) {
  const markerRef = useRef(null);

  const latitude = Number(bus.current_lat);
  const longitude = Number(bus.current_lng);

  const [position, setPosition] = useState([
    latitude,
    longitude,
  ]);

  useEffect(() => {
    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return;
    }

    const startLatitude = position[0];
    const startLongitude = position[1];

    const steps = 30;
    let currentStep = 0;

    const interval = window.setInterval(() => {
      currentStep += 1;

      const progress = currentStep / steps;

      const nextLatitude =
        startLatitude +
        (latitude - startLatitude) * progress;

      const nextLongitude =
        startLongitude +
        (longitude - startLongitude) * progress;

      const nextPosition = [
        nextLatitude,
        nextLongitude,
      ];

      setPosition(nextPosition);

      if (markerRef.current) {
        markerRef.current.setLatLng(nextPosition);
      }

      if (currentStep >= steps) {
        window.clearInterval(interval);
      }
    }, 30);

    return () => {
      window.clearInterval(interval);
    };
  }, [latitude, longitude]);

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={busIcon}
    >
      <Popup>
        <div className="min-w-[170px]">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">
              {bus.name}
            </p>

            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            {bus.number_plate}
          </p>

          {bus.last_updated && (
            <p className="mt-2 border-t border-slate-200 pt-2 text-[11px] text-slate-400">
              Updated{" "}
              {new Date(
                bus.last_updated
              ).toLocaleTimeString()}
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

function MapFocusController({ focusedBus }) {
  const map = useMap();

  useEffect(() => {
    if (!focusedBus) return;

    const lat = Number(focusedBus.current_lat);
    const lng = Number(focusedBus.current_lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    map.flyTo([lat, lng], 16, {
      duration: 1.2,
    });
  }, [focusedBus, map]);

  return null;
}

function BusMap({ buses, selectedRoute, focusedBus }) {
  const routeCoordinates = {
    1: [
      [28.6677, 77.2303],
      [28.6769, 77.2256],
      [28.681, 77.12],
      [28.6425, 77.1227],
    ],
    2: [
      [28.6677, 77.2303],
      [28.7041, 77.1025],
      [28.649, 77.122],
    ],
    3: [
      [28.6677, 77.2303],
      [28.6425, 77.1227],
    ],
  };

  const selectedCoordinates = selectedRoute
    ? routeCoordinates[selectedRoute.id] || []
    : [];

  return (
    <MapContainer
      center={[28.7041, 77.1025]}
      zoom={13}
      style={{
        height: "70vh",
        width: "100%",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapFocusController focusedBus={focusedBus} />

      {buses.map((bus) => {
        const latitude = Number(bus.current_lat);
        const longitude = Number(bus.current_lng);

        if (
          Number.isNaN(latitude) ||
          Number.isNaN(longitude)
        ) {
          return null;
        }

        return (
          <AnimatedBusMarker
            key={bus.id}
            bus={bus}
          />
        );
      })}

      {selectedCoordinates.length > 0 && (
        <Polyline
          positions={selectedCoordinates}
          pathOptions={{
            color: "#10b981",
            weight: 4,
            opacity: 0.85,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      )}
    </MapContainer>
  );
}

export default BusMap;