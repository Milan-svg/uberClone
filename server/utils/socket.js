import { Server } from "socket.io";
import { Captain } from "../models/captain.model.js";
import { User } from "../models/user.model.js";
let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  console.log("SOCKET.IO INITIALIZED");
  io.on("connection", (socket) => {
    console.log(`CLIENT CONNECTED: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      if (userType === "user") {
        await User.findByIdAndUpdate(userId, { socketId: socket.id });
        console.log(`USER ${userId} JOINED W SOCKET ID: ${socket.id}`);
      } else if (userType === "captain") {
        await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
        console.log(`CAPTAIN ${userId} JOINED W SOCKET ID: ${socket.id}`);
      }
    });

    socket.on("update-location-captain", async (data) => {
      const { userId, location } = data;

      if (!location || !location.ltd || !location.lng) {
        return socket.emit("error", { message: "Invalid location data" });
      }

      await Captain.findByIdAndUpdate(userId, {
        location: {
          ltd: location.ltd,
          lng: location.lng,
        },
      });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  console.log(`SENDING MESSAGE TO SOCKET ID: ${socketId} : `, messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("SOCKET.IO NOT INITIALIZED.");
  }
};

export { initializeSocket, sendMessageToSocketId };
