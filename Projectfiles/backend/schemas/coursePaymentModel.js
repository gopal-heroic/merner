const mongoose = require("mongoose");

const cardDetailsSchema = new mongoose.Schema({
  cardholdername: {
    type: String,
    required: true,
    trim: true
  },
  cardnumber: {
    type: String,
    required: true,
    // Store only last 4 digits for security
    set: function(value) {
      return value ? `****-****-****-${value.slice(-4)}` : value;
    }
  },
  cvvcode: {
    type: String,
    // Don't store CVV for security
    set: function(value) {
      return "***";
    }
  },
  expmonthyear: {
    type: String,
    required: true
  },
});

const coursePaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true
    },
    cardDetails: cardDetailsSchema,
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: "INR"
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "completed"
    },
    paymentMethod: {
      type: String,
      default: "card"
    },
    transactionId: {
      type: String,
      unique: true,
      default: function() {
        return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
    }
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Indexes for better performance
coursePaymentSchema.index({ userId: 1 });
coursePaymentSchema.index({ courseId: 1 });
coursePaymentSchema.index({ transactionId: 1 });
coursePaymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model("coursePayment", coursePaymentSchema);