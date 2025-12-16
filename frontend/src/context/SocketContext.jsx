import React, { useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { createContext } from "react";
import { useUser } from "./UserContext";
import { useCaptain } from "./CaptainContext";

export const SocketContext = createContext();
const url = import.meta.env.VITE_BASE_URL;
//console.log("SOCKET CONNECTING TO BASE URL: ", url);
// const socket = io("http://localhost:8000", {
//   autoConnect: true,
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
//   reconnectionDelayMax: 5000,
//   timeout: 20000,
//   transports: ["websocket", "polling"],
// });
const socket = io("https://11q0v75m-8000.inc1.devtunnels.ms", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  transports: ["websocket", "polling"],
});

export const SocketProvider = ({ children }) => {
  const { user } = useUser();
  const { captain } = useCaptain();
  useEffect(() => {
    if (!socket) return;
    const handleConnect = () => {
      console.log("SOCKET CONNECTED, REJOINING ROOM");
      if (user?._id) {
        socket.emit("join", { userId: user._id, userType: "user" });
      }
      if (captain?._id) {
        socket.emit("join", { userId: captain._id, userType: "captain" });
      }
    };
    socket.on("connect", handleConnect);
    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket, user, captain]);
  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("connect", () => {
  //     console.log("SOCKET CONNECTED WITH ID: ", socket.id);
  //   });
  //   socket.on("disconnect", () => {
  //     console.log("SOCKET DISCONNECTED");
  //   });
  //   socket.on("connect_error", (err) => {
  //     console.log("SOCKET CONNECTION ERROR: ", err);
  //   });
  //   return () => {
  //     socket.off("connect");
  //     socket.off("disconnect");
  //     socket.off("connect_error");
  //   };
  // }, [socket]);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
export default SocketProvider;

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    console.error("useSocket MUST BE USED WITH SOCKETPROVIDER");
  }
  return socket;
};
