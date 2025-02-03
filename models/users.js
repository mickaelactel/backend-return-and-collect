const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,
  userType: String,
  created_at: { type: Date, default: Date.now },

  // Localisation
  address: String,
  city: String,
  zipcode: String,
  floor: Number,
  entryCode: String,

  // Payment informations
  paymentMethod: String,
  paymentInfo: {
    paypalAccount: String,
    creditCardNumber: String,
    creditCardDigits: String,
  },

  // Champs spécifiques aux pickers (null si user_type ≠ picker)
  isAvailable: Boolean,
  usedStorage: Number,
  numberOfPackages: Number,
  rating: Number,
  numberOfRatings: Number,
  volume: Number,
  volume_min: Number,
  volume_max: Number,
  profiles: [
    {
      name: String,
      volume: Number,
      volume_min: Number,
      volume_max: Number,
    },
  ],

  // Clé étrangères à faire
  // Reviews
  // Deliveries
  // Payments
  // Issues
});

const User = mongoose.model("users", userSchema);

module.exports = User;
