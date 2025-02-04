const mongoose = require("mongoose");

const issueSchema = mongoose.Schema(
  {
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "deliveries" },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Issue = mongoose.model("reviews", issueSchema);

module.exports = Issue;
