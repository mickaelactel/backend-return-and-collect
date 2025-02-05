var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const bcrypt = require('bcrypt');


router.post('/signup', (req, res) => {
  if(!req.body.email || !req.body.password || !req.body.confirmPassword) { //si un des 3 champs est vide (!) l'erreur de la ligne 11 s'affiche
    res.json({result: false, error: "un champ de saisie est vide"})
    return
  } 
  if(!req.body.email.match(/.+\@.+\..+/)) { // si le nouvel utilisateur ne rentre pas un type email l'erreur de la ligne 15 s'affiche
    res.json({result: false, error: "Email invalid"})
    return
  }


  User.findOne({email: req.body.email}).then(data => {
    if (data !== null) { // si on rentre un email qui est déjà stocker dans la bdd l'erreur de la ligne 22 s'affiche sinon on execute la ligne 25 et on crée un nouvel utilisateur
        res.json({result: false, error: "email déjà existant"})
      } else {
        const hash = bcrypt.hashSync(req.body.password, 10);
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
          phone: req.body.phone,
          address: req.body.address,
          city: req.body.city,
          zipcode: req.body.zipcode,
          usertype: req.body.usertype
        })
        newUser.save().then((newData) => {
          res.json({result: true, user: newData})
        })
      }
    })
    }
  )


  router.post("/signin", (req, res) => {
    if (!req.body.email || !req.body.password) {
      res.json({ result: false, error: "un champ de saisie est vide" });
      return;
    }

    if(!req.body.email.match(/.+\@.+\..+/)) {
      res.json({result: false, error: "Email invalid"})
      return
    }

      User.findOne({ email: req.body.email }).then(data => {
        if (data) {
          if (bcrypt.compareSync(req.body.password, data.password)) {
            res.json({ result: true, data: data});
          } else {
            res.json({ result: false, error: 'Mot de passe incorrect' });
          }
        } else {
          res.json({ result: false, error: 'Email ou mot de passe incorrect' });
        }
        }
      );
    }
  );
    
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
