const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  S_title: {
    type: String,
    required: true,
    trim: true
  },
  S_description: {
    type: String,
    required: true,
    trim: true
  },
  S_content: {
    filename: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  }
});

const courseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    C_educator: {
      type: String,
      required: [true, "Educator name is required"],
      trim: true
    },
    C_title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [200, "Course title cannot exceed 200 characters"]
    },
    C_categories: {
      type: String,
      required: [true, "Course category is required"],
      enum: ["IT & Software", "Finance & Accounting", "Personal Development"],
    },
    C_price: {
      type: String,
      default: "free"
    },
    C_description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
      maxlength: [1000, "Course description cannot exceed 1000 characters"]
    },
    sections: [sectionSchema],
    enrolled: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
courseSchema.index({ userId: 1 });
courseSchema.index({ C_categories: 1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ C_title: "text", C_description: "text" });

module.exports = mongoose.model("course", courseSchema);