import rateLimit from "express-rate-limit";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "You have reached the login attempts limit. Please try again later",
});

function generalRateLimiter(req, res, next) {
  if (!req.originalUrl.includes("/auth")) {
    generalLimiter(req, res, next);
  } else {
    next();
  }
}

export { generalRateLimiter, authLimiter };
