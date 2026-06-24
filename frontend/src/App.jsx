import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import BusMap from "./components/BusMap";

const socket = io("http://localhost:3000");

function App() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/buses")
      .then((res) => setBuses(res.data.buses))
      .catch((err) => console.error(err));

    socket.emit("join-bus-room", 1);

    socket.on("location-update", (data) => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) =>
          bus.id === data.busId
            ? { ...bus, current_lat: data.lat, current_lng: data.lng }
            : bus
        )
      );
    });

    return () => {
      socket.off("location-update");
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-2">🚍 SUGAM Dashboard</h1>
      <p className="text-slate-300 mb-6">Live public transport tracking</p>

      <div className="rounded-xl overflow-hidden mb-6">
        <BusMap buses={buses} />
      </div>
      {buses.map((bus) => (
      <div key={bus.id} className="bg-slate-800 p-4 rounded-xl mt-4">
        <h2 className="text-xl font-semibold">{bus.name}</h2>
        <p>Lat: {bus.current_lat}</p>
        <p>Lng: {bus.current_lng}</p>
      </div>
    ))}
    </div>
  );
}

export default App;