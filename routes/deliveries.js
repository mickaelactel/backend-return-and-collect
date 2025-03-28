var express = require("express");
var router = express.Router();

require("../models/connection");

const User = require("../models/users");
const Delivery = require("../models/deliveries");
//const bcrypt = require("bcrypt");

// Creation de la delivery
router.post("/", (req, res) => {
  const { token, description, volume, pickupAddress, pickupPosition, size } =
    req.body;

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
      pickupPosition,
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
router.get("/userActivity/:token", (req, res) => {
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

// Get picker activity
router.get("/pickerActivity/:token", (req, res) => {
  const { token } = req.params;

  User.findOne({ token }).then((userData) => {
    if (userData) {
      const pickerId = userData._id;
      Delivery.find({ pickerId })
        .populate("senderId", "firstName lastName")
        .then((deliveriesData) => {
          res.json({
            result: true,
            deliveries: deliveriesData,
          });
        });
    } else {
      res.json({ result: false, message: "Data not found" });
    }
  });
});

// Picker delivery information
router.get("/info/:deliveryId", (req, res) => {
  const { deliveryId } = req.params;

  Delivery.findOne({ _id: deliveryId })
    .populate("senderId", "firstName lastName ")
    .populate(
      "pickerId",
      "firstName numberOfDeliveries rating numberOfRatings transportType"
    )
    .then((data) => {
      const {
        volume,
        pickupAddress,
        description,
        price,
        status,
        pickerPosition,
        pickupPosition,
        pickerId,
        secretCode,
      } = data;
      res.json({
        result: true,
        delivery: {
          volume,
          pickupAddress,
          description,
          price,
          status,
          secretCode,
          pickerPosition,
          pickupPosition,
          pickerId,
        },
      });
    });
});

// Picker delivery informations
router.post("/checkSecretCode", (req, res) => {
  const { deliveryId, secretCode } = req.body;

  Delivery.findOne({ _id: deliveryId, secretCode }).then((data) => {
    if (data) {
      res.json({ result: true });
    } else {
      res.json({ result: false });
    }
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
  const { deliveryId, token, pickerPosition } = req.body;

  User.findOne({ token }).then((userData) => {
    const pickerId = userData._id;
    Delivery.findOne({ _id: deliveryId }).then((data) => {
      if (data.status === "LOOKING_FOR_PICKER") {
        Delivery.updateOne(
          { _id: deliveryId },
          { status: "ASSIGNED", pickerId, pickerPosition }
        ).then(() => {
          res.json({
            result: true,
            message: "Delivery assigned",
            data: {
              deliveryId: data._id,
              pickupAddress: data.pickupAddress,
              pickupPosition: data.pickupPosition,
              volume: data.volume,
              size: data.size,
            },
          });
        });
      } else {
        res.json({ result: false, message: "Can't assign delivery" });
      }
    });
  });
});

router.put("/updatePickerPosition", (req, res) => {
  const { deliveryId, latitude, longitude } = req.body;

  Delivery.findOne({ _id: deliveryId }).then((data) => {
    if (data.status === "ASSIGNED") {
      Delivery.updateOne(
        { _id: deliveryId },
        { pickerPosition: { latitude, longitude } }
      ).then(() => {
        res.json({ result: true });
      });
    } else {
      Delivery.updateOne(
        { _id: deliveryId },
        {
          pickerPosition: { latitude: undefined, longitude: undefined },
        }
      ).then(() => {
        res.json({ result: true, message: "pickerPosition erased" });
      });
      res.json({ result: false, error: "Delivery already assigned" });
    }
  });
});

router.put("/status", (req, res) => {
  const { deliveryId, status } = req.body;

  Delivery.findOne({ _id: deliveryId }).then((data) => {
    if (data) {
      Delivery.updateOne({ _id: deliveryId }, { status }).then(() => {
        res.json({ result: true, message: "Delivery updated" });
      });
    } else {
      res.json({ result: false, error: "Cannot update this delivery" });
    }
  });
});

//Avoir la position en direct du livreur. Renvoie position + estimation de la distance et du time remaining.

router.get("/pickerPosition", (req, res) => {});

module.exports = router;
