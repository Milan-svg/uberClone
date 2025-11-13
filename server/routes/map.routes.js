import { Router } from "express";
import { body } from "express-validator";
import { query } from "express-validator";
import {
  getCoordinates,
  getAutoCompleteSuggestions,
  getDistanceTime,
} from "../controllers/map.controller.js";
const mapRouter = Router();

mapRouter
  .route("/get-coordinates")
  .post([query("address").isString().isLength({ min: 3 })], getCoordinates);

mapRouter
  .route("/get-distance-time")
  .post(
    [
      query("origin").isString().isLength({ min: 3 }),
      query("destination").isString().isLength({ min: 3 }),
    ],
    getDistanceTime
  );

mapRouter
  .route("/get-autocomplete-suggestions")
  .post(
    [query("input").isString().isLength({ min: 3 })],
    getAutoCompleteSuggestions
  );

export default mapRouter;
