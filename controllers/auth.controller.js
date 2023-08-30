import User from "../mongodb/models/user.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../middlewares/jwt.js";
import { decode } from "jsonwebtoken";
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
    return res.status(200).json({
      token,
      expiresIn: exp,
      userId: user._id.toString(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export { login };
