import { ApiError } from "../utils/apiError.js";
import { Ride } from "../models/ride.model.js";
import { fetchDistanceTime } from "../services/map.service.js";
import crypto from "crypto";

export async function calculateFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new ApiError(400, "Pickup and destination are required");
  }

  const distanceTime = await fetchDistanceTime(pickup, destination);

  const baseFare = {
    auto: 30,
    car: 50,
    moto: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    moto: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    moto: 1.5,
  };

  const fare = {
    auto: Math.round(
      baseFare.auto +
        (distanceTime.distance.value / 1000) * perKmRate.auto +
        (distanceTime.duration.value / 60) * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car +
        (distanceTime.distance.value / 1000) * perKmRate.car +
        (distanceTime.duration.value / 60) * perMinuteRate.car
    ),
    moto: Math.round(
      baseFare.moto +
        (distanceTime.distance.value / 1000) * perKmRate.moto +
        (distanceTime.duration.value / 60) * perMinuteRate.moto
    ),
  };

  return fare;
}

function generateOtp(num) {
  const otp = crypto
    .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
    .toString();
  return otp;
}

export const createRideService = async (
  user,
  pickup,
  destination,
  vehicleType,
  pickupCoordinates,
  destinationCoordinates
) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new ApiError(400, "All fields are required");
  }

  const fare = await calculateFare(pickup, destination);

  const ride = Ride.create({
    user: user,
    pickup: pickup,
    destination: destination,
    pickupCoordinates: pickupCoordinates,
    destinationCoordinates: destinationCoordinates,
    otp: generateOtp(6),
    fare: fare[vehicleType],
  });
  return ride;
};

export const confirmRideService = async (rideId, captainId) => {
  if (!rideId || !captainId) {
    throw new ApiError(400, "rideId and captainId are required");
  }
  await Ride.findOneAndUpdate(
    { _id: rideId },
    {
      captain: captainId,
      status: "accepted",
    }
  );
  const ride = await Ride.findById(rideId)
    .populate("user")
    .populate("captain")
    .select("+otp");
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }
  return ride;
};

export const startRideService = async (rideId, otp, captainId) => {
  if (!rideId || !captainId || !otp) {
    throw new ApiError(400, "rideId, captainId and otp are required");
  }
  const ride = await Ride.findById(rideId).select("+otp");

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }
  if (!ride.captain || ride.captain._id.toString() !== captainId.toString()) {
    throw new ApiError(403, "Captain is not assigned to this ride");
  }
  // check if status is accepted
  if (ride.status !== "accepted") {
    throw new ApiError(400, "Ride cannot be started in current status");
  }

  // verify OTP
  if (ride.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  const finalRide = await Ride.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "ongoing",
    }
  )
    .populate("user")
    .populate("captain")
    .select("+otp");
  return finalRide;
};
export const endRideService = async (rideId, captainId) => {
  const ride = await Ride.findById(rideId);

  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  if (!ride.captain || ride.captain._id.toString() !== captainId.toString()) {
    throw new ApiError(403, "Captain is not assigned to this ride");
  }
  // check if status is accepted
  if (ride.status !== "ongoing") {
    throw new ApiError(400, "Ride cannot end in current status");
  }

  const finalRide = await Ride.findOneAndUpdate(
    {
      _id: rideId,
    },
    {
      status: "completed",
    }
  )
    .populate("user")
    .populate("captain");
  return finalRide;
};

export const fetchCurrentRide = async (userId, userType) => {
  if (!userId || !userType) {
    throw new ApiError(400, "userId and userType are required");
  }
  const statusPriority = ["ongoing", "accepted", "pending"]; // Most → Least important
  for (const status of statusPriority) {
    let query;
    if (userType === "user") {
      query = {
        user: userId,
        status,
        // Exclude cancelled/completed rides older than 1 hour
        ...(status === "pending" && {
          createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
        }),
      };
    } else {
      query = {
        captain: userId,
        status: { $in: ["ongoing", "accepted"] },
      };
    }

    const ride = await Ride.findOne(query)
      .populate("user")
      .populate("captain")
      .select("+otp")
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    if (ride) return ride;
  }

  return null; // No active ride
};

// ride.service.js
