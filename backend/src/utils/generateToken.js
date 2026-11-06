import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "fallback_skillconnect_jwt_secret_2026";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign({ id: userId }, secret, {
    expiresIn
  });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || "fallback_skillconnect_jwt_secret_2026";
  return jwt.verify(token, secret);
};

