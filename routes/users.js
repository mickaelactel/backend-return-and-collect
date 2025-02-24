var express = require("express");
var router = express.Router();

require("../models/connection");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const uid2 = require("uid2");

// User signup
router.post("/signup", (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    //si un des 3 champs est vide (!) l'erreur de la ligne 11 s'affiche
    res.json({ result: false, error: "un champ de saisie est vide" });
    return;
  }
  if (!email.match(/.+\@.+\..+/)) {
    // si le nouvel utilisateur ne rentre pas un type email l'erreur de la ligne 15 s'affiche
    res.json({ result: false, error: "Email invalid" });
    return;
  }

  const lowerCaseEmail = email.toLowerCase();

  User.findOne({ email: lowerCaseEmail }).then((data) => {
    if (data !== null) {
      // si on rentre un email qui est déjà stocker dans la bdd l'erreur de la ligne 22 s'affiche sinon on execute la ligne 25 et on crée un nouvel utilisateur
      res.json({ result: false, error: "Email already used" });
    } else {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        email: lowerCaseEmail,
        password: hash,
        token: uid2(32),
      });
      newUser.save().then((newData) => {
        res.json({ result: true, token: newData.token });
      });
    }
  });
});

// User change coordinates
router.put("/", (req, res) => {
  const {
    token,
    firstName,
    lastName,
    phone,
    address,
    city,
    zipcode,
    usertype,
    email,
    password,
  } = req.body;

  const newData = {
    firstName,
    lastName,
    phone,
    address,
    city,
    zipcode,
    usertype,
    email,
    password: password ? bcrypt.hashSync(password, 10) : undefined,
  };

  User.findOneAndUpdate({ token }, newData).then((data) => {
    if (data == null) {
      res.json({ result: false, error: "User not found" });
    } else {
      if (newData.password) {
        newData.password = "hello little hacker";
      }
      res.json({ result: true, modifications: newData });
    }
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.json({ result: false, error: "un champ de saisie est vide" });
    return;
  }

  if (!email.match(/.+\@.+\..+/)) {
    res.json({ result: false, error: "Email invalid" });
    return;
  }

  const lowerCaseEmail = email.toLowerCase();
  User.findOne({ email: lowerCaseEmail }).then((data) => {
    if (data) {
      if (bcrypt.compareSync(password, data.password)) {
        const { token, email, userType } = data;
        res.json({ result: true, email, userType, token });
      } else {
        res.json({ result: false, error: "Mot de passe incorrect" });
      }
    } else {
      res.json({ result: false, error: "Email ou mot de passe incorrect" });
    }
  });
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// Récupère les infos du picker désigné.
router.get("/pickerInfo/:id", function (req, res, next) {
  User.findOne({ _id: req.params.id }).then((data) => {
    if (data) {
      res.json({
        result: true,
        data: {
          firstName: data.firstName,
          rating: data.rating,
          reviews: data.reviews,
          numberOfRatings: data.numberOfRatings,
          numberOfDeliveries: data.numberOfDeliveries,
        },
      });
    } else {
      res.json({ result: false, message: "Picker not found" });
    }
  });
});

module.exports = router;
