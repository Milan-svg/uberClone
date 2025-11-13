import { ApiError } from "../utils/apiError.js";
import axios from "axios";

export const fetchCoordinates = async (address) => {
  if (!address) {
    throw new ApiError(404, "address is required");
  }
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;
  const response = await axios.get(url);
  //console.log(response);
  if (response.data.status === "OK") {
    const location = response.data.results[0].geometry.location;
    return {
      ltd: location.lat,
      lng: location.lng,
    };
  } else {
    throw new ApiError(
      400,
      "Unable to fetch coordinates for the given address"
    );
  }
};
export const fetchDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new ApiError(404, "Origin and destination are required");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  const response = await axios.get(url);
  if (response.data.status === "OK") {
    if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
      throw new ApiError(404, "No routes found");
    }

    return response.data.rows[0].elements[0];
  } else {
    throw new ApiError(400, "Unable to fetch distance and time");
  }
};

export const fetchAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new ApiError(404, "query is required");
  }
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  const response = await axios.get(url);
  if (response.data.status === "OK") {
    return response.data.predictions
      .map((prediction) => prediction.description)
      .filter((value) => value);
  } else {
    throw new ApiError(400, "Unable to fetch suggestions");
  }
};
