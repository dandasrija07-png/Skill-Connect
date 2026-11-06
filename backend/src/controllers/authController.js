import { User } from "../models/User.js";
import { generateToken, verifyToken } from "../utils/generateToken.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendPasswordResetEmail } from "../services/emailService.js";

export const register = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      username,
      profileImage,
      location,
      headline,
      bio,
      experienceLevel,
      skillsToTeach,
      skillsToLearn,
      interests,
      preferredLearningMethod,
      availability
    } = req.body;

    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    // Auto-generate unique username if not supplied
    let finalUsername = username;
    if (!finalUsername) {
      const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
      finalUsername = `${base}_${Math.floor(100 + Math.random() * 900)}`;
    }

    const usernameExists = await User.findOne({ username: finalUsername.toLowerCase() });
    if (usernameExists) {
      finalUsername = `${finalUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password,
      username: finalUsername.toLowerCase(),
      profileImage: profileImage || undefined,
      location: location || "Remote / Global",
      headline: headline || "Passionate SkillConnect Member",
      bio: bio || "Enthusiastic about sharing what I know and learning new passions.",
      experienceLevel: experienceLevel || "Intermediate",
      skillsToTeach: skillsToTeach || [],
      skillsToLearn: skillsToLearn || [],
      interests: interests || [],
      preferredLearningMethod: preferredLearningMethod || "Online (Video Call)",
      availability: availability || "Flexible Evenings"
    });

    const token = generateToken(user._id);

    return ApiResponse.success(
      res,
      201,
      {
        user,
        token
      },
      "Account registered successfully!"
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Please provide email and password.");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password.");
    }

    if (user.accountStatus === "suspended" || user.accountStatus === "deactivated") {
      throw new ApiError(403, "Your account is currently inactive. Please contact support.");
    }

    const token = generateToken(user._id);

    // Remove password before returning
    const safeUser = user.toJSON();

    return ApiResponse.success(
      res,
      200,
      {
        user: safeUser,
        token
      },
      `Welcome back, ${user.fullName}!`
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return ApiResponse.success(res, 200, { user }, "User profile retrieved");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  return ApiResponse.success(res, 200, {}, "Logged out successfully");
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Return success to avoid email enumeration
      return ApiResponse.success(
        res,
        200,
        {},
        "If an account with that email exists, reset instructions have been sent."
      );
    }

    const resetToken = generateToken(user._id);
    await sendPasswordResetEmail(user.email, resetToken);

    return ApiResponse.success(
      res,
      200,
      { token: resetToken },
      "Password reset link dispatched."
    );
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      throw new ApiError(400, "Token and new password are required.");
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("+password");

    if (!user) {
      throw new ApiError(400, "Invalid reset token.");
    }

    user.password = newPassword;
    await user.save();

    return ApiResponse.success(res, 200, {}, "Password updated successfully. Please log in.");
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(400, "Current password does not match.");
    }

    user.password = newPassword;
    await user.save();

    return ApiResponse.success(res, 200, {}, "Password changed successfully.");
  } catch (error) {
    next(error);
  }
};
