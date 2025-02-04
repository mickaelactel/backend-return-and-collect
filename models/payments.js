const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    deliverId: { type: mongoose.Schema.Types.ObjectId, ref: "deliveries" },
    amount: { type: Number, required: true },
    currency: {
      type: String,
      enum: ["EUR", "USD", "GBP", "BTC", "ETH"],
      default: "EUR",
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "EUR",
    },
    paymentMethod: {
      type: String,
      enum: ["CREDIT_CARD", "PAYPAL", "OTHER"],
      default: "EUR",
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("payments", paymentSchema);

module.exports = Payment;
