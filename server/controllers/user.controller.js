import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { createUser, loginUserService } from "../services/user.service.js";
import { validationResult } from "express-validator";

const registerUser = asyncHandler(async (req, res) => {
  // recieve name,email,password from user, validate, then add user.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { errors: errors.array() }, "validation error")
      );
  }

  const { fullname, email, password } = req.body;

  const createdUser = await createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email: email,
    password: password,
  });
  const accessToken = createdUser.generateAccessToken();

  return res
    .status(201)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    })
    .json(
      new ApiResponse(
        201,
        { user: createdUser, accessToken: accessToken },
        "user created successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, { errors: errors.array() }, "validation error")
      );
  }
  const { email, password } = req.body;
  //console.log("LOGIN REQ BODY: ", req.body);
  const fetchedUser = await loginUserService({ email, password });
  //generate accesstoken,set accesstoken to cookies
  const accessToken = await fetchedUser.generateAccessToken();
  //console.log("ACCESS TOKEN: ", accessToken);
  // how to set cookies??

  return res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 6 * 60 * 60 * 1000, // 6 hours in milliseconds
    })
    .json(
      new ApiResponse(
        200,
        { user: fetchedUser, accessToken: accessToken },
        "Login Successful"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //clear the cookies
  return res
    .status(200)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(200, {}, "logout successfull"));
});

// const updatePassword = asyncHandler(async (req, res) => {
//   const { newPassword, oldPassword } = req.body;
//   const fetchedUser = req.loggedInUser;
//   const dbUser = await User.findById(fetchedUser._id);
//   if (!dbUser) {
//     throw new ApiError(404, "user doesnt exist");
//   }
//   const isMatch = await dbUser.comparePassword(oldPassword);
//   if (!isMatch) {
//     throw new ApiError(400, "Invalid old password");
//   }
//   dbUser.password = newPassword;
//   dbUser.save();
//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "password updated successfuly"));
// });

const getCurrentUser = asyncHandler(async (req, res) => {
  //console.log("REQ: ", req); caused a headache lol
  const fetchedUser = req.user;
  return res
    .status(200)
    .json(
      new ApiResponse(200, { user: fetchedUser }, "user fetched successfuly")
    );
});
export { registerUser, loginUser, logoutUser, getCurrentUser };
