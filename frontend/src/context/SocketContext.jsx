import React, { useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { createContext } from "react";

export const SocketContext = createContext();
const url = import.meta.env.VITE_BASE_URL;
//console.log("SOCKET CONNECTING TO BASE URL: ", url);
const socket = io("http://localhost:8000");
export const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED WITH ID: ", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("SOCKET DISCONNECTED");
    });
    socket.on("connect_error", (err) => {
      console.log("SOCKET CONNECTION ERROR: ", err);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, []);
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
