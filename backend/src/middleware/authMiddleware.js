import { verifyToken } from "../utils/generateToken.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

export const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized. Please log in to access this resource."));
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new ApiError(401, "The user account belonging to this token no longer exists."));
    }

    if (user.accountStatus === "suspended" || user.accountStatus === "deactivated") {
      return next(new ApiError(403, "Your account has been deactivated or suspended."));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError(401, "Invalid or expired authentication token."));
  }
};

export const optionalAuth = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (user && user.accountStatus === "active") {
      req.user = user;
    }
    next();
  } catch {
    next();
  }
};

