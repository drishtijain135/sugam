import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

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