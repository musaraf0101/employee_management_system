import rateLimit from "express-rate-limit";

export const loginLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many request. Try again after 1 minutes",
    });
  },
});
