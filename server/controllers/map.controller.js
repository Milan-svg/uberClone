import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { validationResult } from "express-validator";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  fetchCoordinates,
  fetchDistanceTime,
  fetchAutoCompleteSuggestions,
} from "../services/map.service.js";
const getCoordinates = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { errors: errors.array() }, "validation errors")
      );
  }
  const { address } = req.query;
  const coordinates = await fetchCoordinates(address);

  return res
    .status(200)
    .json(
      new ApiResponse(200, coordinates, "Coordinates fetched successfully")
    );
});

const getDistanceTime = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { errors: errors.array() }, "validation errors")
      );
  }
  const { origin, destination } = req.query;
  const distanceTime = await fetchDistanceTime(origin, destination);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        distanceTime,
        "Distance and Time fetched successfully"
      )
    );
});

const getAutoCompleteSuggestions = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { errors: errors.array() }, "validation errors")
      );
  }
  const { input } = req.query;
  const distanceTime = await fetchAutoCompleteSuggestions(input);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        distanceTime,
        "Distance and Time fetched successfully"
      )
    );
});
export { getCoordinates, getDistanceTime, getAutoCompleteSuggestions };
