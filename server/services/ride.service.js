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
  vehicleType
) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new ApiError(400, "All fields are required");
  }

  const fare = await calculateFare(pickup, destination);

  const ride = Ride.create({
    user,
    pickup,
    destination,
    otp: generateOtp(6),
    fare: fare[vehicleType],
  });
  console.log("RIDE: ", ride);
  return ride;
};

export const confirmRideService = async (rideId, captain) => {
  if (!rideId || !captain) {
    throw new ApiError(400, "rideId and captain are required");
  }

  const ride = await Ride.findOneAndUpdate(
    { _id: rideId },
    {
      captain: captain._id,
      status: "accepted",
    }
  );
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }
  return ride;
};
