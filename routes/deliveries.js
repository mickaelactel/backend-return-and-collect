var express = require("express");
var router = express.Router();

require("../models/connection");

const User = require("../models/users");
const Delivery = require("../models/deliveries");
//const bcrypt = require("bcrypt");

// Creation de la delivery
router.post("/", (req, res) => {
  const { token, description, volume, pickupAddress, distance } = req.body;

  User.findOne({ token }).then((userData) => {
    const senderId = userData._id;

    const price = Math.floor(distance * Math.random());
    const secretCode = Math.floor(1000 * Math.random())
      .toString()
      .padStart(4, "0");

    const newDelivery = new Delivery({
      senderId,
      description,
      volume,
      pickupAddress,
      price,
      secretCode,
    });

    newDelivery.save().then((newDeliveryData) => {
      const userDeliveriesList = userData.deliveries;
      userDeliveriesList.push(newDeliveryData._id);

      User.updateOne(
        { _id: senderId },
        { deliveries: userDeliveriesList }
      ).then(() => {
        res.json({ result: true, message: "Delivery created" });
      });
    });
  });
});

// Picker gets list of available deliveries
router.get("/lookingForPicker", (req, res) => {
  Delivery.find({ status: "LOOKING_FOR_PICKER" }).then((deliveries) => {
    // Pick one delivery with algorithm
    const randomDelivery = Math.floor(Math.random() * deliveries.length);
    if (deliveries) {
      res.json({ result: true, delivery: deliveries[randomDelivery] });
    } else {
      res.json({ result: false, message: "No deliveries waiting" });
    }
  });
});

//Vient modifier le status de l'objet delivery en "Assigned"
router.post("/assign", (req, res) => {
  const { deliveryId, token } = req.body;

  User.findOne({ token }).then((userData) => {
    const pickerId = userData._id;
    Delivery.findOne({ _id: deliveryId }).then((data) => {
      if (data.status === "LOOKING_FOR_PICKER") {
        Delivery.updateOne(
          { _id: deliveryId },
          { status: "ASSIGNED", pickerId }
        ).then(() => {
          res.json({ result: true, message: "Delivery assigned" });
        });
      } else {
        res.json({ result: false, error: "Delivery already assigned" });
      }
    });
  });
});

//Avoir la position en direct du livreur. Renvoie position + estimation de la distance et du time remaining.

router.get("/pickerPosition", (req, res) => {});

// Get user deliveries
router.get("/:userToken", (req, res) => {
  const { userToken } = req.params;

  User.findOne({ token: userToken }).then((userData) => {
    if (!userData) {
      res.json({ result: false, message: "User not found" });
    } else {
      const { deliveries } = userData;
      res.json({ result: true }, deliveries);
    }
  });
});

module.exports = router;
