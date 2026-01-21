import userModel from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import transporter from "../config/nodemailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplates.js";

export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    // return res.json({ success: false, message: "All Details are required!" });
    return next(new ErrorHandler(400, "All details are required!"));
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    //    return res.json({ success: true, message: "User already exists" });
    return next(new ErrorHandler(409, "User already exists"));
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

  //Sending welcome email
  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject: "Welcome to the MERN Auth System",
    text: `Welcome to MERN Auth System, Your account has been created with email id: ${email}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Log mail error but don't stop registration in production
    console.error("Welcome email failed:", error.message);
  }

  return res
    .status(201)
    .cookie("token", token, cookieOptions)
    .json(
      new ApiResponse(
        201,
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        "User registered successfully",
      ),
    );
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler(400, "Email and password are required!"));
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler(401, "Invalid email or password"));
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(new ErrorHandler(401, "Invalid email or password"));
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
          id: user._id,
          name: user.name,
          email: user.email,
        },
        "Login successful",
      ),
    );
});

export const logout = asyncHandler(async (req, res) => {
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

// Send verification otp to the User's Email
export const sendVerifyOtp = asyncHandler(async (req, res, next) => {
  // Use req.user._id from isAuthenticated middleware for security
  const userId = req.user._id;

  const user = await userModel.findById(userId);

  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }

  if (user.isAccountVerified) {
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAccountVerified: user.isAccountVerified,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, { user: userData }, "Account Already Verified"),
      );
  }

  // Generate a secure 6-digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));

  user.verifyOtp = otp;
  // Set expiration for 24 hours
  user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

  await user.save();

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: user.email,
    subject: "Account verification OTP | MERN Auth System",
    // text: `Your OTP is ${otp}. Use this code to verify your account. It is valid for 24 hours.`,
    html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
      "{{email}}",
      user.email,
    ),
  };

  try {
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Verification OTP Sent on Email"));
  } catch {
    // If mail fails, clear the OTP so the user can try again
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0; // Fixed: Use numeric value instead of boolean
    await user.save();
    return next(
      new ErrorHandler(500, "Email could not be sent. Please try again later."),
    );
  }
});

export const verifyEmail = asyncHandler(async (req, res, next) => {
  // 1. Get userId from req.user (set by isAuthenticated) and otp from req.body
  const userId = req.user._id;
  const { otp } = req.body;

  if (!otp) {
    return next(new ErrorHandler(400, "Please enter the OTP"));
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }

  // 2. Check if OTP is present in DB or if it matches
  if (user.verifyOtp === "" || user.verifyOtp !== otp) {
    return next(new ErrorHandler(400, "Invalid OTP"));
  }

  // 3. Check for expiration
  if (user.verifyOtpExpireAt < Date.now()) {
    return next(new ErrorHandler(400, "OTP has expired"));
  }

  // 4. Update user status and cleanup
  user.isAccountVerified = true;
  user.verifyOtp = "";
  user.verifyOtpExpireAt = 0;

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAccountVerified: user.isAccountVerified,
        },
      },
      "Email verified successfully",
    ),
  );
});

//check if user is authenticated
export const checkAuth = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, {}, "Authenticated"));
});

//Send Password reset OTP
export const sendResetOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler(400, "Email is required"));
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.resetOtp = otp;
  user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; //15min

  await user.save();

  const mailOptions = {
    from: process.env.SMTP_FROM_EMAIL,
    to: user.email,
    subject: "Password Reset OTP | MERN Auth System",
    // text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password. It is valid for 15 Minutes.`,
    html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
      "{{email}}",
      user.email,
    ),
  };

  try {
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset OTP Sent on Email"));
  } catch {
    // If mail fails, clear the OTP so the user can try again
    user.resetOtp = "";
    user.resetOtpExpireAt = 0; // Fixed: Use numeric value instead of boolean
    await user.save();
    return next(
      new ErrorHandler(500, "Email could not be sent. Please try again later."),
    );
  }
});

//Reset user Password
export const resetPassowrd = asyncHandler(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return next(
      new ErrorHandler(400, "Email, OTP and New Password are required"),
    );
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new ErrorHandler(404, "User not found"));
  }

  if (user.resetOtp === "" || user.resetOtp !== otp) {
    return next(new ErrorHandler(400, "Invalid OTP"));
  }

  if (user.resetOtpExpireAt < Date.now()) {
    return next(new ErrorHandler(400, "OTP has Expired"));
  }

  user.password = newPassword;

  user.resetOtp = "";
  user.resetOtpExpireAt = 0;

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAccountVerified: user.isAccountVerified,
        },
      },
      "Password changed successfully",
    ),
  );
});
