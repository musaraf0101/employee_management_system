import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "access dinied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expire token",
    });
  }
};
