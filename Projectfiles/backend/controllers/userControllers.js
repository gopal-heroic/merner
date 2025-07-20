const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = require("../schemas/userModel");
const courseSchema = require("../schemas/courseModel");
const enrolledCourseSchema = require("../schemas/enrolledCourseModel");
const coursePaymentSchema = require("../schemas/coursePaymentModel");

// Register Controller
const registerController = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;

    // Validation
    if (!name || !email || !password || !type) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Check if user already exists
    const existsUser = await userSchema.findOne({ email });
    if (existsUser) {
      return res.status(409).json({ 
        success: false, 
        message: "User already exists with this email" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userSchema({
      name,
      email,
      password: hashedPassword,
      type
    });

    await newUser.save();

    return res.status(201).json({ 
      success: true, 
      message: "Registration successful" 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Registration failed: ${error.message}` 
    });
  }
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required" 
      });
    }

    // Find user
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, type: user.type }, 
      process.env.JWT_KEY, 
      { expiresIn: "7d" }
    );

    // Remove password from user data
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      type: user.type,
      createdAt: user.createdAt
    };

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      userData
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: `Login failed: ${error.message}` 
    });
  }
};

// Get all courses (public)
const getAllCoursesController = async (req, res) => {
  try {
    const allCourses = await courseSchema.find().sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      data: allCourses,
      count: allCourses.length
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch courses" 
    });
  }
};

// Post course controller
const postCourseController = async (req, res) => {
  try {
    const {
      userId,
      C_educator,
      C_title,
      C_categories,
      C_price,
      C_description,
      S_title,
      S_description,
    } = req.body;

    // Validation
    if (!C_educator || !C_title || !C_categories || !C_description) {
      return res.status(400).json({
        success: false,
        message: "All course fields are required",
      });
    }

    // Normalize arrays
    const sTitles = Array.isArray(S_title) ? S_title : [S_title];
    const sDescriptions = Array.isArray(S_description) ? S_description : [S_description];
    const files = req.files || [];

    // Validate arrays
    if (sTitles.length !== files.length || sDescriptions.length !== files.length) {
      return res.status(400).json({
        success: false,
        message: "Mismatch between titles, descriptions, and uploaded files",
      });
    }

    // Build sections
    const sections = files.map((file, i) => ({
      S_title: sTitles[i],
      S_description: sDescriptions[i],
      S_content: {
        filename: file.filename,
        path: `/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size
      },
    }));

    // Set price
    const price = C_price == 0 ? "free" : C_price;

    // Create course
    const course = new courseSchema({
      userId,
      C_educator,
      C_title,
      C_categories,
      C_price: price,
      C_description,
      sections,
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      courseId: course._id
    });

  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Get all courses for teacher
const getAllCoursesUserController = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const allCourses = await courseSchema.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: allCourses,
      count: allCourses.length
    });
  } catch (error) {
    console.error("Error fetching teacher courses:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch courses" 
    });
  }
};

// Delete course controller
const deleteCourseController = async (req, res) => {
  const { courseid } = req.params;
  
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseid)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid course ID" 
      });
    }

    const course = await courseSchema.findByIdAndDelete(courseid);

    if (course) {
      // Clean up related data
      await enrolledCourseSchema.deleteMany({ courseId: courseid });
      await coursePaymentSchema.deleteMany({ courseId: courseid });
      
      res.status(200).json({ 
        success: true, 
        message: "Course deleted successfully" 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete course" 
    });
  }
};

// Enroll in course - UPDATED
const enrolledCourseController = async (req, res) => {
  const { courseid } = req.params;
  const { userId } = req.body;
  
  try {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(courseid)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid course ID" 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid user ID" 
      });
    }

    const course = await courseSchema.findById(courseid);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    const courseLength = course.sections.length;

    // Check if already enrolled
    const existingEnrollment = await enrolledCourseSchema.findOne({
      courseId: courseid,
      userId: userId,
    });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
        course: { id: course._id, Title: course.C_title },
      });
    }

    // Calculate amount based on course price
    const coursePrice = course.C_price === 'free' ? 0 : parseFloat(course.C_price) || 0;

    // Generate dummy payment details
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create enrollment
    const enrolledCourseInstance = new enrolledCourseSchema({
      courseId: courseid,
      userId: userId,
      course_Length: courseLength,
    });

    // Create payment record with dummy data
    const coursePayment = new coursePaymentSchema({
      userId: userId,
      courseId: courseid,
      amount: coursePrice,
      cardDetails: req.body.cardDetails || {
        cardholdername: req.body.cardholdername || 'Free Course',
        cardnumber: req.body.cardnumber || '0000-0000-0000-0000',
        cvvcode: req.body.cvvcode || '000',
        expmonthyear: req.body.expmonthyear || '12/2025'
      },
      status: 'completed',
      paymentMethod: coursePrice === 0 ? 'free' : 'card',
      transactionId: paymentId
    });

    // Use transaction to ensure atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await coursePayment.save({ session });
      await enrolledCourseInstance.save({ session });
      
      // Atomically increment enrollment count and get updated course
      const updatedCourse = await courseSchema.findByIdAndUpdate(
        courseid, 
        { $inc: { enrolled: 1 } },
        { new: true, session }
      );

      await session.commitTransaction();

      res.status(200).json({
        success: true,
        message: "Enrollment successful",
        course: { 
          id: updatedCourse._id, 
          Title: updatedCourse.C_title,
          enrolled: updatedCourse.enrolled 
        },
        payment: {
          paymentId,
          orderId,
          amount: coursePrice,
          status: 'success'
        }
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to enroll in course" 
    });
  }
};

// NEW: Fake payment endpoint
const fakePaymentController = async (req, res) => {
  const { courseid } = req.params;
  
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseid)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid course ID" 
      });
    }

    const course = await courseSchema.findById(courseid);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    const coursePrice = course.C_price === 'free' ? 0 : parseFloat(course.C_price) || 0;
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.status(200).json({
      success: true,
      payment: {
        amount: coursePrice,
        paymentId,
        orderId,
        status: 'success'
      }
    });
  } catch (error) {
    console.error("Error processing fake payment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Payment processing failed" 
    });
  }
};

// NEW: Forgot password endpoint
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address"
      });
    }

    // Check if user exists (optional - for security, you might not want to reveal this)
    const user = await userSchema.findOne({ email });
    
    // Always return success for security reasons (don't reveal if email exists)
    res.status(200).json({
      success: true,
      message: `Reset link sent to ${email}`
    });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reset link"
    });
  }
};

// Send course content
const sendCourseContentController = async (req, res) => {
  const { courseid } = req.params;
  const { userId } = req.body;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseid)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid course ID" 
      });
    }

    const course = await courseSchema.findById(courseid);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const enrolledUser = await enrolledCourseSchema.findOne({
      userId: userId,
      courseId: courseid,
    });

    if (!enrolledUser) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    return res.status(200).json({
      success: true,
      courseContent: course.sections,
      completeModule: enrolledUser.progress || [],
      certficateData: enrolledUser,
    });
  } catch (error) {
    console.error("Error fetching course content:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Complete section
const completeSectionController = async (req, res) => {
  const { courseId, sectionId } = req.body;
  const { userId } = req.body;

  try {
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid course ID" 
      });
    }

    const enrolledCourse = await enrolledCourseSchema.findOne({
      courseId: courseId,
      userId: userId,
    });

    if (!enrolledCourse) {
      return res.status(403).json({ 
        success: false, 
        message: "You are not enrolled in this course" 
      });
    }

    // Check if section already completed
    const isAlreadyCompleted = enrolledCourse.progress.some(
      progress => progress.sectionId === sectionId
    );

    if (isAlreadyCompleted) {
      return res.status(409).json({ 
        success: false, 
        message: "Section already completed" 
      });
    }

    // Add to progress
    const updatedProgress = [...enrolledCourse.progress, { sectionId: sectionId }];

    await enrolledCourseSchema.findByIdAndUpdate(
      enrolledCourse._id,
      { 
        progress: updatedProgress,
        ...(updatedProgress.length === enrolledCourse.course_Length && {
          certificateDate: new Date()
        })
      },
      { new: true }
    );

    res.status(200).json({ 
      success: true, 
      message: "Section completed successfully" 
    });
  } catch (error) {
    console.error("Error completing section:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};

// Get all enrolled courses for user
const sendAllCoursesUserController = async (req, res) => {
  const { userId } = req.body;
  
  try {
    const enrolledCourses = await enrolledCourseSchema.find({ userId });
    
    const coursesDetails = await Promise.all(
      enrolledCourses.map(async (enrolledCourse) => {
        return await courseSchema.findById(enrolledCourse.courseId);
      })
    );

    // Filter out null values (in case some courses were deleted)
    const validCourses = coursesDetails.filter(course => course !== null);

    return res.status(200).json({
      success: true,
      data: validCourses,
      count: validCourses.length
    });
  } catch (error) {
    console.error("Error fetching user courses:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch enrolled courses" 
    });
  }
};

module.exports = {
  registerController,
  loginController,
  getAllCoursesController,
  postCourseController,
  getAllCoursesUserController,
  deleteCourseController,
  enrolledCourseController,
  sendCourseContentController,
  completeSectionController,
  sendAllCoursesUserController,
  fakePaymentController,
  forgotPasswordController,
};