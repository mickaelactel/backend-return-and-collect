const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    phone: { type: String, match: /^[0-9]{10,15}$/ },
    password: { type: String, required: true },
    userType: {
      type: String,
      enum: ["PICKER", "SENDER"],
      default: "SENDER",
    },

    // Localisation
    address: String,
    city: String,
    zipcode: String,
    floor: Number,
    entryCode: String,

    // Payment informations
    paymentMethod: { type: String, enum: ["PAYPAL", "CREDIT_CARD"] },
    paymentInfo: {
      paypalAccount: String,
      creditCardNumber: String, // Hashé
      creditCardLastDigits: String, // Quatre derniers chiffres
      creditCardDigitsSecurityDigits: String, // Chiffres derrière la carte
    },
  
     //information de paiement picker
    creditMethod: {
      iban: String,
      bic: String,
    },

    // Champs spécifiques aux pickers (null si user_type ≠ picker)
    isAvailable: { type: Boolean, default: false },
    usedStorage: { type: Number, default: 0 },
    numberOfPackages: { type: Number, default: 0 },
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
    rating: Number,
    numberOfRatings: Number,

    // Clé étrangères à faire
    reviews: { type: [mongoose.Schema.Types.ObjectId], ref: "reviews" },
    deliveries: { type: [mongoose.Schema.Types.ObjectId], ref: "deliveries" },
    payments: { type: [mongoose.Schema.Types.ObjectId], ref: "payments" },
    issues: { type: [mongoose.Schema.Types.ObjectId], ref: "issues" },
  },
  { timestamps: true }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
