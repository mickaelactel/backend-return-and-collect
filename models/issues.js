const mongoose = require("mongoose");

const issueSchema = mongoose.Schema(
  {
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "deliveries" },
    comment: { type: String, required: true },
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

const Issue = mongoose.model("reviews", issueSchema);

module.exports = Issue;
