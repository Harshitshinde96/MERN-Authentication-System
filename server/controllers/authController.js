import userModel from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  // console.log(req.body);

  if (!name || !email || !password) {
    // return res.json({ success: false, message: "All Details are required!" });
    throw new ErrorHandler(400, "All details are required!");
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    //   return res.json({ success: true, message: "User already exists" });
    throw new ErrorHandler(409, "User already exists");
  }

  const user = await userModel.create({ name, email, password });

  // generateJWTToken() - this method is written userModel.js file
  const token = user.generateJWTToken();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(201)
    .cookie("token", token, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        "User registered successfully"
      )
    );
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ErrorHandler(400, "Email and password are required!");
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    throw new ErrorHandler(401, "Invalid email");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ErrorHandler(401, "Invalid password");
  }

  const token = user.generateJWTToken();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        "Login successful"
      )
    );
});

export const logout = asyncHandler(async (req, res, next) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };

  // Clear the cookie
  return res
    .status(200)
    .clearCookie("token", cookieOptions) // This line logouts the user
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});
