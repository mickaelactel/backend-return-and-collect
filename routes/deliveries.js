var express = require("express");
var router = express.Router();

require("../models/connection");

const User = require("../models/users");
const Delivery = require("../models/deliveries");
//const bcrypt = require("bcrypt");

// Creation de la delivery
router.post("/", (req, res) => {
  const { token, description, volume, pickupAddress, size } = req.body;

  User.findOne({ token }).then((userData) => {
    const senderId = userData._id;

    const price = Math.floor(10 * Math.random());
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
      size,
    });

    newDelivery.save().then((newDeliveryData) => {
      const userDeliveriesList = userData.deliveries;
      userDeliveriesList.push(newDeliveryData._id);

      User.updateOne(
        { _id: senderId },
        { deliveries: userDeliveriesList }
      ).then((deliveryData) => {
        res.json({
          result: true,
          message: "Delivery created",
          data: newDeliveryData,
        });
      });
    });
  });
});

// Get user activity
router.get("/activity/:token", (req, res) => {
  const { token } = req.params;

  User.findOne({ token }).then((userData) => {
    if (userData) {
      const senderId = userData._id;
      Delivery.find({ senderId })
        .populate("pickerId", "firstName lastName")
        .then((deliveriesData) => {
          res.json({
            result: true,
            deliveries: deliveriesData,
          });
        });
    } else {
      res.json({ result: false, message: "User not found" });
    }
  });
});

// Picker gets list of available deliveries
router.get("/info/:deliveryId", (req, res) => {
  const { deliveryId } = req.params;

  Delivery.findOne({ _id: deliveryId })
    .populate("senderId", "firstName lastName ")
    .populate("pickerId", "firstName rating numberOfRatings transportType")
    .then((data) => {
      const { volume, pickupAddress, description, price, status } = data;
      res.json({
        result: true,
        delivery: { volume, pickupAddress, description, price, status },
      });
    });
});

// Picker gets list of available deliveries
router.get("/isLookingForPicker", (req, res) => {
  Delivery.find({ status: "LOOKING_FOR_PICKER" })
    .populate("senderId", "firstName lastName")
    .then((deliveries) => {
      // Pick one delivery with algorithm
      // const randomDelivery = Math.floor(Math.random() * deliveries.length);
      if (deliveries) {
        res.json({ result: true, deliveries });
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

router.post("/cancel", (req, res) => {
  const { deliveryId, token } = req.body;

  User.findOne({ token }).then((userData) => {
    const senderId = userData._id;
    Delivery.findOne({ _id: deliveryId }).then((data) => {
      if (data && data.status !== "CANCELED") {
        Delivery.updateOne(
          { _id: deliveryId, senderId },
          { status: "CANCELED" }
        ).then(() => {
          res.json({ result: true, message: "Delivery canceled" });
        });
      } else {
        res.json({ result: false, error: "Cannot cancel this delivery" });
      }
    });
  });
});

//Avoir la position en direct du livreur. Renvoie position + estimation de la distance et du time remaining.

router.get("/pickerPosition", (req, res) => {});

// Get user deliveries
router.get("/:userToken", (req, res) => {
  const { userToken } = req.params;

  User.findOne({ token: userToken })
    .populate("deliveries")
    .then((userData) => {
      if (!userData) {
        res.json({ result: false, message: "User not found" });
      } else {
        const { deliveries } = userData;
        res.json({ result: true, deliveries });
      }
    });
});

module.exports = router;
