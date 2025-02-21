var express = require("express");
var router = express.Router();

require("../models/connection");

const User = require("../models/users");
const Delivery = require("../models/deliveries");
const Review = require("../models/reviews");

// Review creation
router.post("/", (req, res) => {
  const { token, deliveryId, rating, comment } = req.body;

  User.findOne({ token }).then((userData) => {
    const senderId = userData._id;

    Delivery.findOne({ _id: deliveryId }).then((delivery) => {
      if (!delivery) {
        res.json({ result: false, message: "Delivery not found" });
      } else {
        Review.findOne({ deliveryId }).then((delivery) => {
          if (delivery) {
            // Review on delivery already exists -> update it
            Review.updateOne({ deliveryId }, { rating, comment }).then(() => {
              res.json({ result: true, message: "Delivery review updated" });
            });
          } else {
            // Review on delivery does not exist -> create it
            const newReview = new Review({
              senderId,
              deliveryId,
              rating,
              comment,
            });

            newReview.save().then(() => {
              // TODO : Middleware to compute meanRating at each save ? Or compute it here (use controller/service architecture to clarify)
              res.json({
                result: true,
                message: "Delivery successfully reviewed",
              });
            });
          }
        });
      }
    });
  });
});

// Get mean rating of a picker
router.get("/meanRating", (req, res) => {
  const { pickerId } = req.body;

  Review.find({ pickerId }).then((reviews) => {
    if (!reviews) {
      res.json({ result: false, meanRating: 5 });
    } else {
      const meanRating =
        reviews.reduce((acc, cum) => {
          acc += cum.rating;
          return acc;
        }, 0) / reviews.length;

      res.json({ result: true, meanRating });
    }
  });
});

module.exports = router;
