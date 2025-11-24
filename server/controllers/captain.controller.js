import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { validationResult } from "express-validator";
import { createCaptain } from "../services/captain.service.js";
import { Captain } from "../models/captain.model.js";

const registerCaptain = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { errors: errors.array() }, "Validation Error")
      );
  }
  const { fullname, email, password, vehicle } = req.body;
  const createdCaptain = await createCaptain({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email: email,
    password: password,
    color: vehicle.color,
    capacity: vehicle.capacity,
    plate: vehicle.plate,
    vehicleType: vehicle.vehicleType,
  });
  const accessToken = createdCaptain.generateAccessToken();
  return res
    .status(201)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    })
    .json(
      new ApiResponse(
        201,
        { captain: createdCaptain, accessToken: accessToken },
        "Captain created successfully"
      )
    );
});

const loginCaptain = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { errors: errors.array() }, "Validation Error")
      );
  }
  const { email, password } = req.body;
  const captain = await Captain.findOne({ email: email }).select("+password");
  if (!captain) {
    throw new ApiError(404, "Captain not found");
  }
  const isMatch = await captain.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid password");
  }
  const accessToken = await captain.generateAccessToken();
  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 6 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        { captain: captain, accessToken: accessToken },
        "Captain logged in successfully"
      )
    );
});
const logoutCaptain = asyncHandler(async (req, res) => {
  //clear the cookies
  return res
    .status(200)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(200, {}, "logout successfull"));
});

const getCurrentCaptain = asyncHandler(async (req, res) => {
  const fetchedCaptain = req?.user;

  return res
    .status(200)
    .json(new ApiResponse(200, fetchedCaptain, "captain fetched successfully"));
});
export { registerCaptain, loginCaptain, logoutCaptain, getCurrentCaptain };
