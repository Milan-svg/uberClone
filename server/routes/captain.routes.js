import { Router } from "express";
import { body } from "express-validator";
import {
  getCurrentCaptain,
  loginCaptain,
  logoutCaptain,
  registerCaptain,
} from "../controllers/captain.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const captainRouter = Router();

captainRouter
  .route("/register")
  .post(
    [
      body("email").isEmail().withMessage("Invalid Email"),
      body("fullname.firstname")
        .isLength({ min: 3 })
        .withMessage("First name must be at least 3 characters long"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
      body("vehicle.color")
        .isLength({ min: 3 })
        .withMessage("Color must be at least 3 characters long"),
      body("vehicle.plate")
        .isLength({ min: 3 })
        .withMessage("Plate must be at least 3 characters long"),
      body("vehicle.capacity")
        .isInt({ min: 1 })
        .withMessage("Capacity must be at least 1"),
      body("vehicle.vehicleType")
        .isIn(["car", "motorcycle", "auto"])
        .withMessage("Invalid vehicle type"),
    ],
    registerCaptain
  );

captainRouter
  .route("/login")
  .post(
    [
      body("email").isEmail().withMessage("Invalid Email"),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ],
    loginCaptain
  );
captainRouter.route("/logout").get(verifyJWT, logoutCaptain);

captainRouter.route("/get-current-captain").get(verifyJWT, getCurrentCaptain);

export default captainRouter;
