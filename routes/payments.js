var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");

router.post("/iban", (req, res) => {
  if (!req.body.name || !req.body.bankName || !req.body.iban || !req.body.bic) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  if (!req.body.iban.match(/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/)) {
    res.json({ result: false, error: "Invalid IBAN" });
    return;
  }
  if (!req.body.bic.match(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)) {
    res.json({ result: false, error: "Invalid BIC" });
    return;
  } else {
    User.findOne({ token: req.body.token }).then((data) => {
      if (data == null) {
        res.json({ result: false, error: "No picker found" });
      } else {
        const creditMethod = {
          name: req.body.name,
          bankName: req.body.bankName,
          iban: req.body.iban,
          bic: req.body.bic,
        };
        User.updateOne({ token: req.body.token }, { creditMethod }).then(
          (data) => res.json({ result: true, creditMethod: data })
        );
      }
    });
  }
});

router.post("/card", (req, res) => {
  if (
    !req.body.bankName ||
    !req.body.name ||
    !req.body.creditCardNumber ||
    !req.body.expirationDate ||
    !req.body.creditCardSecurityDigits
  ) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  if (
    !req.body.creditCardNumber.match(
      /\b(?:\d{4}[ -]?){3}(?=\d{4}\b)/
    )
  ) {
    res.json({ result: false, error: "Invalid card number" });
    return;
  }
  if (
    !req.body.expirationDate.match(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/)
  ) {
    res.json({ result: false, error: "Invalid expiration date" });
    return;
  } else {
    User.findOne({ token: req.body.token }).then((data) => {
      if (data == null) {
        res.json({ result: false, error: "No user found" });
      } else {
        const paymentInfo = {
          bankName: req.body.bankName,
          name: req.body.name,
          creditCardNumber: req.body.creditCardNumber,
          expirationDate: req.body.expirationDate,
          creditCardSecurityDigits: req.body.creditCardSecurityDigits,
        };
        User.updateOne({ token: req.body.token }, { paymentInfo }).then(
          (data) => res.json({ result: true, paymentInfo: data })
        );
      }
    });
  }
});

// recupere les infos de paiement du picker
router.get("/accountInfos/:token", function (req, res) {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) { 
      res.json({
        result: true,
        data: {
          bankName: data.creditMethod.bankName,
          name: data.creditMethod.name,
          iban: data.creditMethod.iban,
          bic: data.creditMethod.bic,
        }, 
      });
    } else {
      res.json({ result: false, message: "Bank account not found" });
    }
  });
});

router.get("/cardInfos/:token", function (req, res) {
  User.findOne({ token: req.params.token }).then((data) => {
    if (data) { 
      res.json({
        result: true,
        data: {
          bankName: data.paymentInfo.bankName,
          name: data.paymentInfo.name,
          creditCardNumber: data.paymentInfo.creditCardNumber,
          expirationDate: data.paymentInfo.expirationDate,
          creditCardSecurityDigits: data.paymentInfo.creditCardSecurityDigits,
        }, 
      });
    } else {
      res.json({ result: false, message: "Card not found" });
    }
  });
});

module.exports = router;
