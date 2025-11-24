// middlewares/auth.js
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

/**
 * Middleware xác thực người dùng bằng JWT
 * - Hỗ trợ cả header Authorization và cookie HttpOnly
 * - Kiểm tra user tồn tại và account đang Active
 */
const auth = async (req, res, next) => {
  try {
    let token = null;

    // 1. Lấy token từ header Authorization (Bearer xxx)
    const authHeader = req.headers?.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Nếu không có trong header thì lấy từ cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 3. Không có token → 401
    if (!token) {
      return res.status(401).json({
        message: "No token provided. Please login again.",
        error: true,
        success: false,
      });
    }

    // 4. Xác thực token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    } catch (err) {
      console.error("JWT verify failed:", err.message);
      return res.status(401).json({
        message: "Invalid or expired token",
        error: true,
        success: false,
      });
    }

    // 5. Lấy user từ DB
    const user = await UserModel.findById(decoded.id).select("_id role status");
    if (!user) {
      return res.status(401).json({
        message: "User not found or deleted",
        error: true,
        success: false,
      });
    }

    // 6. Kiểm tra trạng thái tài khoản
    if (user.status !== "Active") {
      return res.status(403).json({
        message: "Your account is not active. Please contact admin.",
        error: true,
        success: false,
      });
    }

    // 7. Gắn thông tin user vào request
    req.userId = user._id.toString();
    req.userRole = user.role;

    // 8. Cho phép đi tiếp
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      message: "Unauthorized",
      error: true,
      success: false,
    });
  }
};

export default auth;
