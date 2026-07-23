import { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const socket = io(SOCKET_URL);

function useSocket(onLocationUpdate) {
  useEffect(() => {
    socket.emit("join-bus-room", 1);

    socket.on("location-update", onLocationUpdate);

    return () => {
      socket.off("location-update", onLocationUpdate);
    };
  }, [onLocationUpdate]);

  return socket;
}

export default useSocket;