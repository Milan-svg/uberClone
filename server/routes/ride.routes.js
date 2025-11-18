import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import { createRide, getFare } from "../controllers/ride.controller.js";
import { body, query } from "express-validator";
const rideRouter = Router();

rideRouter
  .route("/create-ride")
  .post(
    [
      body("pickup")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Invalid pickup address"),
      body("destination")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Invalid destination address"),
      body("vehicleType")
        .isString()
        .isIn(["auto", "car", "moto"])
        .withMessage("Invalid vehicle type"),
    ],
    verifyJWT,
    createRide
  );
rideRouter
  .route("/get-fare")
  .get(
    [
      query("pickup").isString().isLength({ min: 3 }),
      query("destination").isString().isLength({ min: 3 }),
    ],
    getFare
  );

export default rideRouter;
