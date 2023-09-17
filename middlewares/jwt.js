import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

function generateAccessToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: 120 });
}

function generateRefreshToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET_REFRESHTOKEN, {
    expiresIn: 300,
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          expireTime: true,
          message: "JWT has expired. Please login again.",
        });
      }
      return res.status(422).json({
        success: false,
        message: "JWT Verification Issue.",
      });
    }

    req.userId = data.userId;
    req.role = data.role;

    next();
  });
}

export { generateAccessToken, generateRefreshToken, authenticateToken };
