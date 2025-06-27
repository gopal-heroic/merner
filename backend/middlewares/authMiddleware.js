const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header missing", success: false });
    }

    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Token missing", success: false });
    }

    jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Token is not valid", success: false });
      } else {
        req.body.userId = decode.id;
        req.user = decode; // Add user info to request
        next();
      }
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};