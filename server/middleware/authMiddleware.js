const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Please log in to continue."
      });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.userId
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token."
    });
  }
}

module.exports = authMiddleware;