import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Captain } from "../models/captain.model.js";
import { ApiError } from "../utils/apiError.js";
const verifyJWT = async (req, res, next) => {
  // fetch token from req
  //validate it if not valid, throw error/return
  //if valid, extract userId from token,
  //find the userObj with userId and attach that userOBJ to req
  //call next();
  //console.log("VERIFY JWT REQ: ", req.cookies);
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }
    //decode token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { _id, role } = decodedToken;

    let loggedInUser;

    if (role === "user") {
      loggedInUser = await User.findById(_id);
    } else if (role === "captain") {
      loggedInUser = await Captain.findById(_id);
    } else {
      return next(new ApiError(401, "Invalid role in token"));
    }
    if (!loggedInUser) {
      throw new ApiError(401, "invalid token");
    }
    // attached user obj to req and userType depending on the schema of the user obj.
    req.user = loggedInUser;
    req.role = role;
    next();
  } catch (error) {
    return next(new ApiError(401, error?.message || "Invalid access token"));
  }
};

// const verifyCaptainJWT = async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//       throw new ApiError(401, "unauthorized request");
//     }
//     //decode token
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     const loggedInUser = await Captain.findById(decodedToken?._id).select(
//       "-password"
//     );
//     if (!loggedInUser) {
//       throw new ApiError(401, "invalid token");
//     }
//     req.user = loggedInUser;
//     next();
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Invalid access token");
//   }
// };

export { verifyJWT };
