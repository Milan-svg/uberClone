import { Captain } from "../models/captain.model.js";
import { ApiError } from "../utils/apiError.js";

export const createCaptain = async ({
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
}) => {
  if (
    [
      firstname,
      lastname,
      email,
      password,
      color,
      plate,
      capacity,
      vehicleType,
    ].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check if captain alrdy exists
  const existingCaptain = await Captain.findOne({ email: email });
  if (existingCaptain) {
    throw new ApiError(409, "captain already exists");
  }
  const captain = await Captain.create({
    fullname: {
      firstname: firstname,
      lastname: lastname,
    },
    email: email,
    password: password,
    vehicle: {
      color: color,
      plate: plate,
      capacity: capacity,
      vehicleType: vehicleType,
    },
  });
  return captain;
};
