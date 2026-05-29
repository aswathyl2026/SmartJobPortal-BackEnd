const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    console.log("Inside Authentication Method");

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing",
      });
    }

    const jwtResponse = jwt.verify(token, process.env.JWTSECRET);

    req.user = jwtResponse;

    console.log("Decoded User:", req.user);

    next();
  } catch (err) {
    console.log("Auth Error:", err.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;