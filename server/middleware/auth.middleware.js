import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please Login Again." });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = tokenDecode.id;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;
