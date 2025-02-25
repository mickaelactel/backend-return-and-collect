var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");


router.post("/ibanbic", (req, res) => {
    if (!req.body.name || !req.body.iban || !req.body.bic) {
      res.json({ result: false, error: "un champ de saisie est vide" });
      return;
    }
    if (!req.body.iban.match(/\b[A-Z]{2}[0-9]{2}(?:[ ]?[0-9]{4}){4}(?!(?:[ ]?[0-9]){3})(?:[ ]?[0-9]{1,2})?\b/)) {
      res.json({ result: false, error: "Iban invalid" });
      return;
    }
    if (!req.body.bic.match(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)) {
        res.json({result: false, error: "Bic invalid"})
        return;
    } else {
        const newIban = new Iban({
            name: req.body.name,
            iban: req.body.iban,
            bic: req.body.bic,
          });
          newIban.save().then((newData) => {
            res.json({ result: true, user: newData });
          });
    }


}
)