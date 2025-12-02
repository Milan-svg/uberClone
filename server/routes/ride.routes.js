import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";
import {
  cleanupStaleRides,
  confirmRide,
  createRide,
  endRide,
  getCurrentRide,
  getFare,
  startRide,
} from "../controllers/ride.controller.js";
import { body, query } from "express-validator";
const rideRouter = Router();

rideRouter.route("/create-ride").post(
  verifyJWT,
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

rideRouter.route("/confirm").post(
  verifyJWT,
  [body("rideId").isMongoId().withMessage("Invalid ride id")],

  confirmRide
);
rideRouter
  .route("/start")
  .get(
    verifyJWT,
    [
      query("rideId").isMongoId().withMessage("Invalid ride id"),
      query("otp")
        .isString()
        .isLength({ min: 6, max: 6 })
        .withMessage("Invalid OTP"),
    ],
    startRide
  );

rideRouter
  .route("/end")
  .post(
    verifyJWT,
    body("rideId").isMongoId().withMessage("Invalid ride id"),
    endRide
  );
rideRouter.route("/current").get(verifyJWT, getCurrentRide);
rideRouter.route("/cleanup").delete(verifyJWT, cleanupStaleRides);

export default rideRouter;
