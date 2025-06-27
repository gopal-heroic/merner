const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllCoursesController,
  deleteCourseController,
  deleteUserController,
} = require("../controllers/adminController");

const router = express.Router();

// Admin middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.type === 'Admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required."
    });
  }
};

// All admin routes require authentication and admin privileges
router.get("/getallusers", authMiddleware, adminMiddleware, getAllUsersController);
router.get("/getallcourses", authMiddleware, adminMiddleware, getAllCoursesController);
router.delete('/deletecourse/:courseid', authMiddleware, adminMiddleware, deleteCourseController);
router.delete('/deleteuser/:userid', authMiddleware, adminMiddleware, deleteUserController);

module.exports = router;