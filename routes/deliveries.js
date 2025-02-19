var express = require("express");
var router = express.Router();

require("../models/connection");

const User = require("../models/users");
const Delivery = require("../models/deliveries");
//const bcrypt = require("bcrypt");


//Vient modifier le status de l'objet delivery en "Assigned"

router.put("/assign/:id", (req, res) => {
  Delivery.findOne({ pickerId: req.body.pickerId }).then((data) => {
    if (data.status === "LOOKING FOR PICKER") {
      Delivery.status.updateOne("ASSIGNED");
    } else {
      res.json({ result: false, error: "Transporteur non disponible" });
    }
  });
});


//Avoir la position en direct du livreur. Renvoie position + estimation de la distance et du time remaining.

router.get("/pickerPosition", (req, res) => {
  
})

module.exports = router;