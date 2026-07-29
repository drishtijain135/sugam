import { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const socket = io(SOCKET_URL);

function useSocket(busId, onLocationUpdate) {
  useEffect(() => {
    if (!busId) return;

    socket.emit("join-bus-room", busId);

    socket.on("location-update", onLocationUpdate);

    return () => {
      socket.off("location-update", onLocationUpdate);
    };
  }, [busId, onLocationUpdate]);

  return socket;
}

export default useSocket;