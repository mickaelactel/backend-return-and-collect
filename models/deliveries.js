const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

const deliverySchema = mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  pickerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  description: { type: String, required: true },
  volume: { type: Number },
  size: { type: String },
  pickupAddress: { type: String, required: true },
  deliveryAddress: { type: String },
  pickupTime: Date,
  deliveryTime: Date,
  status: {
    type: String,
    enum: [
      "LOOKING_FOR_PICKER",
      "ASSIGNED",
      "IN_TRANSIT",
      "DELIVERED",
      "CANCELED",
    ],
    default: "LOOKING_FOR_PICKER",
  },
  price: { type: Number },
  secretCode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// TODO : Décommenter ça pour avoir le hashage du secret_code au moment du save

// deliverySchema.pre("save", async function (next) {
//   if (!this.isModified("secretCode")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.secretCode = await bcrypt.hash(this.secretCode, salt);
//   next();
// });

const Delivery = mongoose.model("deliveries", deliverySchema);

module.exports = Delivery;
