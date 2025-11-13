import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export const createUser = async ({ firstname, lastname, email, password }) => {
  if (
    [firstname, lastname, email, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // check if user alrdy exists
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    throw new ApiError(409, "user already exists");
  }
  //create user
  const user = await User.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
  });
  return user;
};

export const loginUserService = async ({ email, password }) => {
  if ([email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "invalid password");
  }
  return user;
};
