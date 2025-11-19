export const authorizedRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userId || !req.userRole) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};
