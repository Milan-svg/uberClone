import { asyncHandler } from "../utils/asyncHandler.js";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  calculateFare,
  confirmRideService,
  createRideService,
  endRideService,
  fetchCurrentRide,
  startRideService,
} from "../services/ride.service.js";
import {
  fetchCaptainsInRadius,
  fetchCoordinates,
} from "../services/map.service.js";
import { Ride } from "../models/ride.model.js";
import { sendMessageToSocketId } from "../utils/socket.js";

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
  const userId = req?.user._id;
  //console.log("USERId:", userId);
  const ride = await createRideService(
    userId,
    pickup,
    destination,
    vehicleType
  );
  //console.log("RIDE: ", ride);
  // get coordinates from pickup
  //get nearby captains using the pickup ltd and lng and the getCaptainsInRadius service
  const coordinates = await fetchCoordinates(pickup);
  //console.log("PICKUP COORDS: ", coordinates);
  const captainsInRadius = await fetchCaptainsInRadius(
    coordinates.ltd,
    coordinates.lng,
    2
  );
  ride.otp = "";
  const rideObjWithUser = await Ride.findOne({ _id: ride._id }).populate(
    "user"
  );
  captainsInRadius.map((captain) => {
    sendMessageToSocketId(captain.socketId, {
      event: "new-ride",
      data: rideObjWithUser,
    });
  });
  //console.log("CAPTAINS IN RADIUS: ", captains);
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

  const { rideId } = req.body;
  const captainId = req.user._id;
  const ride = await confirmRideService(rideId, captainId);
  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-confirmed",
    data: ride,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, ride, "Ride Confirmed successfully"));
});

const startRide = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { errors: errors.array() }, "validation error")
      );
  }

  const { rideId, otp } = req.query;
  const captainId = req.user._id;
  const ride = await startRideService(rideId, otp, captainId);

  console.log(ride);

  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-started",
    data: ride,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, ride, "Ride Started successfully"));
});

const endRide = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { errors: errors.array() }, "validation error")
      );
  }

  const { rideId } = req.body;
  const captainId = req.user._id;

  const ride = await endRideService(rideId, captainId);

  sendMessageToSocketId(ride.user.socketId, {
    event: "ride-ended",
    data: ride,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, ride, "Ride Ended successfully"));
});

const getCurrentRide = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userType = req.userType;
  //console.log({ USERID: userId, TYPE: userType });
  const ride = await fetchCurrentRide(userId, userType);
  if (!ride) {
    return res
      .status(200)
      .json(new ApiResponse(200, ride, "No current active rides"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, ride, "Current ride fetched successfully"));
});

const cleanupStaleRides = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userType = req.userType;

  const cutoff = new Date(Date.now() - 30 * 60 * 1000); // 30min

  const result = await Ride.updateMany(
    {
      ...(userType === "user" ? { user: userId } : { captain: userId }),
      status: "pending",
      createdAt: { $lt: cutoff },
    },
    { status: "cancelled" }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { cancelled: result.modifiedCount },
        "Stale rides cleared"
      )
    );
});

export {
  createRide,
  confirmRide,
  getFare,
  startRide,
  endRide,
  getCurrentRide,
  cleanupStaleRides,
};
