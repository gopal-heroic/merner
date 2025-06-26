const express = require("express");
const multer = require("multer");

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
} = require("../controllers/userControllers");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

router.post("/register", registerController);

router.post("/login", loginController);

router.post('/addcourse', upload.array('S_content', 10), postCourseController);

router.get('/getallcourses', getAllCoursesController)

router.get('/getallcoursesteacher', authMiddleware, getAllCoursesUserController)

router.delete('/deletecourse/:courseid', authMiddleware, deleteCourseController)

router.post('/enrolledcourse/:courseid', authMiddleware, enrolledCourseController)

router.get('/coursecontent/:courseid', authMiddleware, sendCourseContentController)

router.post('/completemodule', authMiddleware, completeSectionController)

router.get('/getallcoursesuser', authMiddleware, sendAllCoursesUserController)



module.exports = router;
