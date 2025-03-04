const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    token: { type: String },
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
      name: String,
      paypalAccount: String,
      creditCardNumber: String, // Hashé
      creditCardLastDigits: String, // Quatre derniers chiffres
      creditCardSecurityDigits: String, // Chiffres derrière la carte
      expirationDate: String,
      bankName: String,
    },

    //information de paiement picker
    creditMethod: {
      name: String,
      bankName: String,
      iban: String,
      bic: String,
    },

    // Champs spécifiques aux pickers (null si user_type ≠ picker)
    isAvailable: { type: Boolean, default: false },
    usedStorage: { type: Number, default: 0 },
    numberOfPackages: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    volume_min: { type: Number, default: 0 },
    volume_max: { type: Number, default: 999 },
    profiles: [
      {
        name: String,
        volume: Number,
        volume_min: Number,
        volume_max: Number,
      },
    ],
    numberOfDeliveries: { type: Number, default: 0 },

    rating: { type: Number, default: 5 },
    numberOfRatings: { type: Number, default: 0 },
    transportType: {
      type: String,
      enum: ["Vélo 🚲", "Scooter 🛵", "Voiture 🚗", "Camion 🚛"],
      default: null,
    },

    // Clé étrangères à faire
    reviews: { type: [mongoose.Schema.Types.ObjectId], ref: "reviews" },
    deliveries: { type: [mongoose.Schema.Types.ObjectId], ref: "deliveries" },
    payments: { type: [mongoose.Schema.Types.ObjectId], ref: "payments" },
    issues: { type: [mongoose.Schema.Types.ObjectId], ref: "issues" },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.userType === "SENDER") {
    this.rating = null;
    this.numberOfRatings = null;
    this.isAvailable = null;
    this.usedStorage = null;
    this.numberOfPackages = null;
    this.volume = null;
    this.volume_min = null;
    this.volume_max = null;
    this.numberOfDeliveries = null;
  }
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
