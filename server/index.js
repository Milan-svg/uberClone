import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import { initializeSocket } from "./utils/socket.js";
import { createServer } from "http";
const app = express();

//middlewares
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "https://11q0v75m-5173.inc1.devtunnels.ms",

    credentials: true,
  })
);

app.use(express.json({ limit: "12kb" }));
app.use(cookieParser());
//connect to mongodb
dotenv.config({ path: "./.env" });

console.log(process.env.MONGODB_URL);
mongoose
  .connect(`${process.env.MONGODB_URL}/milan1`)
  .then((connectionInstance) =>
    console.log(
      `MONGODB connected, DB HOST: ${connectionInstance.connection.host}`
    )
  )
  .catch((err) => {
    console.log("MONGODB CONNECTION ERROR:", err);
    process.exit(1);
  });

//Routes
import userRouter from "./routes/user.routes.js";
import captainRouter from "./routes/captain.routes.js";
import mapRouter from "./routes/map.routes.js";
import rideRouter from "./routes/ride.routes.js";
app.use("/api/v1/users", userRouter);
app.use("/api/v1/captains", captainRouter);
app.use("/api/v1/map", mapRouter);
app.use("/api/v1/rides", rideRouter);
// app.get("/", (req, res) => {
//   res.json({ message: "Server is running" });
// });

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = createServer(app);
initializeSocket(server);
server.listen(PORT, () => {
  console.log("server running on:", PORT);
});
