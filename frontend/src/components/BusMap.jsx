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
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #34d399;
      border: 4px solid white;
      border-radius: 50%;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
      font-size: 21px;
    ">
      🚌
    </div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -24],
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
        <div className="min-w-[180px]">
          <p className="text-base font-bold text-slate-900">
            🚌 {bus.name}
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Number plate: {bus.number_plate}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

            <span className="text-sm font-semibold text-emerald-600">
              Live
            </span>
          </div>

          {bus.last_updated && (
            <p className="mt-2 text-xs text-slate-500">
              Updated:{" "}
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
            weight: 7,
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      )}
    </MapContainer>
  );
}

export default BusMap;