import User from "../mongodb/models/user.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/jwt.js";

import { decode } from "jsonwebtoken";
import jwt from "jsonwebtoken";

let refreshTokens = [];

const login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const passwordMatches = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatches) {
      return res.status(400).json({ message: "Invalid password" });
    }
    if (!user.isActive) {
      return res.status(401).json({ message: "User account is deactivated" });
    }
    const token = generateAccessToken({ userId: user._id, role: user.role });

    const { exp } = decode(token);

    const refreshToken = generateRefreshToken({
      userId: user._id,
      role: user.role,
    });

    refreshTokens.push({
      refreshToken: refreshToken,
      userId: user._id,
      role: user.role,
    });

    return res.status(200).json({
      token,
      expiresIn: exp,
      refreshToken,
      userId: user._id.toString(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshTokenReq = req.body.refreshToken;
    const refreshTokenExistsinArray = refreshTokens.find(
      (refreshTokenObj) => refreshTokenObj.refreshToken === refreshTokenReq
    );

    if (!refreshTokenExistsinArray) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    jwt.verify(
      refreshTokenReq,
      process.env.JWT_SECRET_REFRESHTOKEN,
      (err, data) => {
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
      }
    );

    const userInDB = await User.findById(req.userId);

    console.log("**************", req.userId);

    if (
      !userInDB ||
      !userInDB.isActive ||
      userInDB.role !== refreshTokenExistsinArray.role
    ) {
      return res.status(401).json({ message: "Invalid user information" });
    }

    const token = generateAccessToken({
      userId: refreshTokenExistsinArray.userId,
      role: refreshTokenExistsinArray.role,
    });

    const { exp } = decode(token);

    const refreshToken = generateRefreshToken({
      userId: refreshTokenExistsinArray.userId,
      role: refreshTokenExistsinArray.role,
    });

    refreshTokenExistsinArray.refreshToken = refreshToken;

    return res.status(200).json({
      token,
      expiresIn: exp,
      refreshToken,
      userId: refreshTokenExistsinArray.userId.toString(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const rejectRefreshToken = async (req, res) => {
  try {
    const refreshTokenReq = req.body.refreshToken;
    refreshTokens = refreshTokens.filter(
      (refreshTokenObj) => refreshTokenObj.refreshToken !== refreshTokenReq
    );
    return res.status(200).json({ message: "Refresh token rejected" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export { login, refreshToken, rejectRefreshToken };
