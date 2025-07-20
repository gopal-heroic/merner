const express = require("express");
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerController,
  loginController,
  postCourseController,
  getAllCoursesUserController,
  deleteCourseController,
  getAllCoursesController,
  enrolledCourseController,
  sendCourseContentController,
  completeSectionController,
  sendAllCoursesUserController,
  fakePaymentController,
  forgotPasswordController,
} = require("../controllers/userControllers");

const router = express.Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);
router.get('/getallcourses', getAllCoursesController);
router.post('/forgot-password', forgotPasswordController);

// Protected routes
router.post('/addcourse', authMiddleware, upload.array('S_content', 10), postCourseController);
router.get('/getallcoursesteacher', authMiddleware, getAllCoursesUserController);
router.delete('/deletecourse/:courseid', authMiddleware, deleteCourseController);
router.post('/enrolledcourse/:courseid', authMiddleware, enrolledCourseController);
router.get('/coursecontent/:courseid', authMiddleware, sendCourseContentController);
router.post('/completemodule', authMiddleware, completeSectionController);
router.get('/getallcoursesuser', authMiddleware, sendAllCoursesUserController);
router.get('/fake-payment/:courseid', authMiddleware, fakePaymentController);

module.exports = router;