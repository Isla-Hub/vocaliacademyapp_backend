import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

function generateAccessToken(data) {
  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "86400s" });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.userId = data.userId;
    req.role = data.role;

    next();
  });
}

export { generateAccessToken, authenticateToken };
