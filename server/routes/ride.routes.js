import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { createRide } from "../controllers/ride.controller.js";

const rideRouter = Router();

rideRouter.post("/", verifyJWT, createRide);

export default rideRouter;
