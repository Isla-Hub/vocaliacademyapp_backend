import User from "../mongodb/models/user.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/jwt.js";

let refreshTokens = {};

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

    const refreshToken = generateRefreshToken({
      userId: user._id,
      role: user.role,
    });

    refreshTokens[refreshToken] = user._id;

    console.log("**********", refreshTokens);

    return res.status(200).json({
      token,
      refreshToken,
      userId: user._id.toString(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (refreshToken in refreshTokens) {
      const user = await User.findById(refreshTokens[refreshToken]);
      if (!user) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
      const token = generateAccessToken({ userId: user._id, role: user.role });
      return res.status(200).json({ token });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const rejectRefreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (refreshToken in refreshTokens) {
      delete refreshTokens[refreshToken];
    }
    return res.status(200).json({ message: "Refresh token rejected" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export { login, refreshToken, rejectRefreshToken };
