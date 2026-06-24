import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function BusMap({ buses }) {
  return (
    <MapContainer
      center={[28.7041, 77.1025]}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {buses.map((bus) => (
        <Marker
          key={bus.id}
          position={[bus.current_lat, bus.current_lng]}
        >
          <Popup>
            <strong>{bus.name}</strong>
            <br />
            {bus.number_plate}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default BusMap;