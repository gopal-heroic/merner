const userSchema = require("../schemas/userModel");
const courseSchema = require("../schemas/courseModel");
const enrolledCourseSchema = require("../schemas/enrolledCourseModel");
const coursePaymentSchema = require("../schemas/coursePaymentModel");

const getAllUsersController = async (req, res) => {
  try {
    const allUsers = await userSchema.find().select('-password').sort({ createdAt: -1 });
    
    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No users found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: allUsers,
      count: allUsers.length 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Error fetching users: ${error.message}` 
    });
  }
};

const getAllCoursesController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find().sort({ createdAt: -1 });
    
    if (!allCourses || allCourses.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No courses found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: allCourses,
      count: allCourses.length 
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Error fetching courses: ${error.message}` 
    });
  }
};

const deleteCourseController = async (req, res) => {
  const { courseid } = req.params;
  
  try {
    // Check if course exists
    const course = await courseSchema.findById(courseid);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    // Delete related enrolled courses and payments
    await enrolledCourseSchema.deleteMany({ courseId: courseid });
    await coursePaymentSchema.deleteMany({ courseId: courseid });
    
    // Delete the course
    await courseSchema.findByIdAndDelete(courseid);

    res.status(200).json({ 
      success: true, 
      message: "Course and related data deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete course" 
    });
  }
};

const deleteUserController = async (req, res) => {
  const { userid } = req.params;
  
  try {
    // Check if user exists
    const user = await userSchema.findById(userid);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Delete user's courses if they are a teacher
    if (user.type === 'Teacher') {
      const userCourses = await courseSchema.find({ userId: userid });
      for (const course of userCourses) {
        await enrolledCourseSchema.deleteMany({ courseId: course._id });
        await coursePaymentSchema.deleteMany({ courseId: course._id });
      }
      await courseSchema.deleteMany({ userId: userid });
    }

    // Delete user's enrollments and payments if they are a student
    if (user.type === 'Student') {
      await enrolledCourseSchema.deleteMany({ userId: userid });
      await coursePaymentSchema.deleteMany({ userId: userid });
    }
    
    // Delete the user
    await userSchema.findByIdAndDelete(userid);

    res.status(200).json({ 
      success: true, 
      message: "User and related data deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete user" 
    });
  }
};

module.exports = {
  getAllUsersController,
  getAllCoursesController,
  deleteCourseController,
  deleteUserController,
};