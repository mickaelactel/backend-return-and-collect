const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "deliveries",
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    issueType: {
      type: String,
      enum: ["LOST", "BROKEN", "OTHER"],
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
