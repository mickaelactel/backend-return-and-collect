var express = require("express");
var router = express.Router();

require("../models/connection");
const CreditMethod = require("../models/users");


router.post("/ibanbic", (req, res) => {
    if (!req.body.name || !req.body.bankName || !req.body.iban || !req.body.bic) {
      res.json({ result: false, error: "un champ de saisie est vide" });
      return;
    }
    if (!req.body.iban.match(/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/)) {
      res.json({ result: false, error: "Iban invalid" });
      return;
    }
    if (!req.body.bic.match(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)) {
        res.json({result: false, error: "Bic invalid"})
        return;
    } else {
        const newCreditMethod = new CreditMethod({
            name: req.body.name,
            bankName: req.body.bankName,
            iban: req.body.iban,
            bic: req.body.bic,
          });
          newCreditMethod.save().then((newData) => {
            res.json({ result: true, CreditMethod: newData });
          });
    }
}
)

// picker change payment method

router.put('/')


module.exports = router;