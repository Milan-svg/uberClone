import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse.js";
import { calculateFare, createRideService } from "../services/ride.service.js";

const createRide = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { errors: errors.array() }, "validation error")
      );
  }
  // console.log("REQ:", req.body);
  const { pickup, destination, vehicleType } = req?.body;
  const user = req.user;
  console.log("USER:", user);
  const ride = await createRideService(user, pickup, destination, vehicleType);
  return res
    .status(200)
    .json(new ApiResponse(201, ride, "Ride created successfully"));
});

const getFare = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { errors: errors.array() }, "validation error")
      );
  }
  const { pickup, destination } = req.query;
  const fare = await calculateFare(pickup, destination);
  return res
    .status(200)
    .json(new ApiResponse(200, fare, "Fare calculated successfully"));
});

const confirmRide = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { errors: errors.array() }, "validation error")
      );
  }
});
export { createRide, confirmRide, getFare };
