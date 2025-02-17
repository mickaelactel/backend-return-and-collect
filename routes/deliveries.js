var express = require("express");
var router = express.Router();

require("../models/connection");

const User = require("../models/User");
const Delivery = require("../models/deliveries");
//const bcrypt = require("bcrypt");

router.put("/assign/:id", (req, res) => {
  Delivery.findOne({ pickerId: req.body.pickerId }).then((data) => {
    if (data.status === "LOOKING FOR PICKER") {
      Delivery.status.updateOne("ASSIGNED");
    } else {
      res.json({ result: false, error: "Transporteur non disponible" });
    }
  });
});




router.get("/pickerInfos", (req, res) => {


})

