const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(403).json({
      error: "Authorization header not found",
    });
  }

  // Split the token and use a different variable name
  const tokenWithoutBearer = token.split("Bearer ")[1];

  try {
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: "error", message: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyToken;
