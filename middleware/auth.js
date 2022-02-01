const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("auth_token");

  // Check if there's a token
  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied!" });
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    // Setting User to the req Server
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid Token!" });
  }
};
