const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  sectionId: {
    type: Number,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

const enrolledCourseSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    course_Length: {
      type: Number,
      required: true,
      min: 1
    },
    progress: [progressSchema],
    certificateDate: {
      type: Date,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate enrollments
enrolledCourseSchema.index({ courseId: 1, userId: 1 }, { unique: true });

// Indexes for better performance
enrolledCourseSchema.index({ userId: 1 });
enrolledCourseSchema.index({ courseId: 1 });
enrolledCourseSchema.index({ createdAt: -1 });

module.exports = mongoose.model("enrolledCourses", enrolledCourseSchema);